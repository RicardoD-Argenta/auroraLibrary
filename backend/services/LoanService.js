// models
    const Loan = require('../models/Loan/Loans')
    const BookCopy = require('../models/Book/BookCopy')
    const Book = require('../models/Book/Book')
    const User = require('../models/User/User')
    const Member = require('../models/Library/Member')
    const LoanDelay = require('../models/loan/LoanDelay')
    const LibraryParams = require('../models/Library/LibraryParams')

// imports
    const Counter = require('../models/Counter')

// services
    const BookService = require('./BookService')
    const bookService = new BookService()

    const LibraryService = require('./LibraryService')
    const libraryService = new LibraryService()

    const UserService = require('./UserService')
    const userService = new UserService()


module.exports = class LoanService {
    // ------------------------ criação de empréstimos ------------------------ //

    async registeredLoan(loanData) {
        const loan = await Loan.findOne({
            copyId: loanData.copyId,
            status: 'active',
            _id: { $ne: loanData.id }
        })
        if (loan) {
            return {
                valid: false,
                message: 'Existe um empréstimo ativo para este exemplar',
                err: 'loan-already-registered'
            }
        }
        else {
            return {
                valid: true,
                loan
            }
        }
    }

    async existingLoan(loanData) {
        try {
            const loan = await Loan.findOne({
                _id: loanData.id
            })
            if (!loan) {
                return {
                    valid: false,
                    message: 'Empréstimo não cadastrado',
                    err: 'loan-not-registered'
                }
            }
            return {
                valid: true,
                loan
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar empréstimo',
                err: error.message
            }
        }
    }

    async registerLoan(loanData) {
        // verifica se o exemplar existe
        const book = await bookService.existingBookCopy({
            id: loanData.copyId
        })
        if (book && !book.valid) {
            return book
        }

        if (book.bookCopy.status !== 'available') {
            return {
                valid: false,
                message: 'O exemplar não está disponível para empréstimo',
                err: 'copy-not-available'
            }
        }

        // verifica se o exemplar já está emprestado, pra garantir que mesmo q o mano mude no banco o status do exemplar ele ñ cadastre dois emprestimos pro mesmo exemplar
        const registeredLoan = await this.registeredLoan(loanData)
        if (registeredLoan && !registeredLoan.valid) {
            return registeredLoan
        }

        // puxa a condição do exemplar no momento do empréstimo
        const conditionOut = book.bookCopy.condition

        // verifica se o membro existe
        const member = await libraryService.existingMember({
            id: loanData.memberId
        })
        if (member && !member.valid) {
            return member
        }

        // verifica se o operador existe
        const operator = await userService.existingUser({
            id: loanData.operatorId
        })
        if (operator && !operator.valid) {
            return operator
        }

        const code = await Counter.nextSequence('loan')

        const loan = new Loan({
            code,
            copyId: loanData.copyId,
            memberId: loanData.memberId,
            operatorId: loanData.operatorId,
            notes: loanData.notes,
            loanDate: loanData.loanDate,
            dueDate: loanData.dueDate,
            returnDate: loanData.returnDate,
            status: loanData.status,
            conditionOut: conditionOut,
            conditionIn: loanData.conditionIn
        })
        try {
            const newLoan = await loan.save()
            await BookCopy.findByIdAndUpdate(loanData.copyId, { status: 'borrowed' })
            return {
                valid: true,
                message: 'Empréstimo cadastrado com sucesso',
                loan: newLoan
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar empréstimo',
                err: error.message
            }
        }
    }

    async allLoans({ page = 1, search = '', status = '', fromDate = '', toDate = '' } = {}) {
        try {
            const limit = 12
            const skip = (page - 1) * limit

            let query = {}

            if (status) query.status = status

            if (fromDate || toDate) {
                query.loanDate = {}
                if (fromDate) query.loanDate.$gte = new Date(fromDate)
                if (toDate) query.loanDate.$lte = new Date(toDate + 'T23:59:59.999Z')
            }

            if (search) {
                const regex = { $regex: search, $options: 'i' }

                const [bookMatches, userMatches, memberMatches] = await Promise.all([
                    Book.find({ title: regex }, '_id'),
                    User.find({ name: regex }, '_id'),
                    Member.find({ name: regex }, '_id')
                ])

                const copyMatches = await BookCopy.find({ bookId: { $in: bookMatches.map(b => b._id) } }, '_id')
                const userIds = userMatches.map(u => u._id)
                const memberIds = memberMatches.map(m => m._id)

                const orConditions = [
                    { notes: regex },
                    { copyId: { $in: copyMatches.map(c => c._id) } },
                    { memberId: { $in: memberIds } },
                    { operatorId: { $in: userIds } },
                ]

                const codeNumber = parseInt(search)
                if (!isNaN(codeNumber)) orConditions.push({ code: codeNumber })

                query.$or = orConditions
            }

            const [loans, total] = await Promise.all([
                Loan.find(query)
                    .populate({ path: 'copyId', populate: { path: 'bookId', select: 'title' } })
                    .populate('memberId', 'name email phone student member')
                    .populate('operatorId', 'name')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Loan.countDocuments(query)
            ])

            const pendingDelays = await LoanDelay.find({ loanId: { $in: loans.map(l => l._id) }, paid: false }, 'loanId')
            const delayMap = {}
            pendingDelays.forEach(d => { delayMap[d.loanId.toString()] = d._id })

            const loansWithDelay = loans.map(loan => {
                const obj = loan.toObject()
                obj.delayId = delayMap[loan._id.toString()] || null
                return obj
            })

            return {
                valid: true,
                loans: loansWithDelay,
                total,
                pages: Math.ceil(total / limit)
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar empréstimos',
                err: error.message
            }
        }
    }

    async loanById(loanData) {
        try {
            const loan = await Loan.findById(loanData.id)
                .populate({ path: 'copyId', populate: { path: 'bookId', select: 'title' } })
                .populate('memberId', 'name email phone student member')
                .populate('operatorId', 'name')
            if (!loan) {
                return {
                    valid: false,
                    message: 'Empréstimo não cadastrado',
                    err: 'loan-not-registered'
                }
            }
            return { valid: true, loan }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar empréstimo',
                err: error.message
            }
        }
    }


    async updateLoan(loanData) {
        const existingLoan = await this.existingLoan(loanData)
        if (existingLoan && !existingLoan.valid) {
            return existingLoan
        }

        if (existingLoan.loan.status == 'returned') {
            return {
                valid: false,
                message: 'Este empréstimo já foi devolvido',
                err: 'loan-already-returned'
            }
        }

        const delay = await LoanDelay.find({
            loanId: loanData.id,
            paid: false
        })
        if (delay && delay.length > 0) {
            return {
                valid: false,
                message: 'Existe uma multa não paga para este empréstimo',
                err: 'loan-delay-exists'
            }
        }

        const loanDate = new Date(existingLoan.loan.loanDate)
        const dueDate = new Date(loanData.dueDate)
        const returnDate = loanData.returnDate ? new Date(loanData.returnDate) : null

        if (loanDate.getTime() > dueDate.getTime()) {
            return {
                valid: false,
                message: 'Data de vencimento deve ser maior que a data de empréstimo',
                err: 'invalid-due-date'
            }
        }

        if (returnDate && loanDate.getTime() > returnDate.getTime()) {
            return {
                valid: false,
                message: 'Data de devolução deve ser maior que a data de empréstimo',
                err: 'invalid-return-date'
            }
        }

        // verifica se já existe um exemplar ativo
        const registeredLoan = await this.registeredLoan({
            id: loanData.id,
            copyId: existingLoan.loan.copyId,
            status: loanData.status
        })
        if (registeredLoan && !registeredLoan.valid) {
            return registeredLoan
        }

        const loan = existingLoan.loan
        loan.set({
            notes: loanData.notes,
            dueDate: loanData.dueDate,
            returnDate: loanData.returnDate,
            conditionIn: loanData.conditionIn,
            status: loanData.status
        })

        try {
            const updatedLoan = await loan.save()

            if (loanData.status === 'returned') {
                await BookCopy.findByIdAndUpdate(existingLoan.loan.copyId, { status: 'available' })
                await BookCopy.findByIdAndUpdate(existingLoan.loan.copyId, { condition: loanData.conditionIn })
            }
            else if (loanData.status === 'overdue' || loanData.status === 'active') {
                await BookCopy.findByIdAndUpdate(existingLoan.loan.copyId, { status: 'borrowed' })
            }
            else if (loanData.status === 'lost') {
                await BookCopy.findByIdAndUpdate(existingLoan.loan.copyId, { status: 'lost' })
            }

            return {
                valid: true,
                message: 'Empréstimo atualizado com sucesso',
                loan: updatedLoan
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar empréstimo',
                err: error.message
            }
        }
    }

    async deleteLoan(loanData) {
        const existingLoan = await this.existingLoan(loanData)
        if (existingLoan && !existingLoan.valid) {
            return existingLoan
        }

        const delay = await LoanDelay.find({
            loanId: loanData.id,
        })
        if (delay && delay.length > 0) {
            return {
                valid: false,
                message: 'Existe uma multa para este empréstimo',
                err: 'loan-delay-exists'
            }
        }

        try {
            const activeLoan = await Loan.findOne({
                copyId: existingLoan.loan.copyId,
                status: 'active',
                _id: { $ne: existingLoan.loan._id }
            })

            await Loan.findByIdAndDelete(existingLoan.loan._id)

            if (!activeLoan) {
                await BookCopy.findByIdAndUpdate(existingLoan.loan.copyId, { status: 'available' })
            }

            return {
                valid: true,
                message: 'Empréstimo excluído com sucesso'
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao excluir empréstimo',
                err: error.message
            }
        }
    }

    // ------------------------ empréstimos vencidos ------------------------ //
    async verifyOverdueLoans() {
        let loans = []

        let overdueLoans = []

        let delays = []

        // verifica se há empréstimos vencidos
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            // verifica os empréstimos ativos com data de vencimento menor que a data atual
            loans = await Loan.find({ status: 'active', dueDate: { $lt: today } })

            // verifica os empréstimos vencidos com data de vencimento menor que a data atual
            overdueLoans = await Loan.find({ status: 'overdue', dueDate: { $lt: today } })

            // verifica as multas não pagas
            delays = await LoanDelay.find({ paid: false })

            // retorna mensagem de sucesso se não houver nenhum empréstimo vencido ou multa não paga
            if (loans.length === 0 && delays.length === 0 && overdueLoans.length === 0) {
                return { valid: true, message: 'Nenhum empréstimo vencido para verificar!' }
            }
        } catch (error) {
            return { valid: false, message: 'Erro ao verificar empréstimos vencidos!', err: error }
        }


        // atualiza os dias e taxa das multas não pagas além de atualizar os status dos empréstimos vencidos no bookCopy e no loan
        try {
            // puxa os parâmetros uma única vez antes dos loops
            const schoolParams = await LibraryParams.findOne()

            for (const loan of loans) {
                // atualiza o status do empréstimo para vencido no bookCopy e no loan
                await BookCopy.findByIdAndUpdate(loan.copyId, { status: 'borrowed' })
                await Loan.findByIdAndUpdate(loan._id, { status: 'overdue' })
                const delay = await LoanDelay.findOne({ loanId: loan._id })

                if (delay) {
                    continue
                }


                // verifica se o parametro de atraso está ativo
                if (schoolParams.params.loanDelay.active) {

                    // calcula quantos dias foram atrasados
                    let daysLate = Math.floor((new Date().getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24))

                    const code = await Counter.nextSequence('loandelay')

                    // calcula a multa
                    let fineValue = schoolParams.params.loanDelay.fineValue
                    let dailyRate = schoolParams.params.loanDelay.dailyRate
                    // fórmula de cálculo da multa: valor da multa + (dias de atraso * (taxa diária / 100) * valor da multa) 
                    let overdueFeeFormula = Math.ceil(fineValue + ((daysLate * (dailyRate / 100)) * fineValue))

                    // cria objeto de multa
                    const loanDelay = {
                        code,
                        loanId: loan._id,
                        overdueDays: daysLate,
                        overdueFee: overdueFeeFormula,
                        paid: false,
                        paidAt: null
                    }
                    try {
                        await LoanDelay.create(loanDelay)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }

            for (const loan of overdueLoans) {
                // atualiza o status do empréstimo para vencido no bookCopy e no loan
                await BookCopy.findByIdAndUpdate(loan.copyId, { status: 'borrowed' })
                const delay = await LoanDelay.findOne({ loanId: loan._id })

                if (delay) {
                    continue
                }

                // verifica se o parametro de atraso está ativo
                if (schoolParams.params.loanDelay.active) {

                    // calcula quantos dias foram atrasados
                    let daysLate = Math.floor((new Date().getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24))

                    const code = await Counter.nextSequence('loandelay')

                    // calcula a multa
                    let fineValue = schoolParams.params.loanDelay.fineValue
                    let dailyRate = schoolParams.params.loanDelay.dailyRate
                    // fórmula de cálculo da multa: valor da multa + (dias de atraso * (taxa diária / 100) * valor da multa) 
                    let overdueFeeFormula = Math.ceil(fineValue + ((daysLate * (dailyRate / 100)) * fineValue))

                    // cria objeto de multa
                    const loanDelay = {
                        code,
                        loanId: loan._id,
                        overdueDays: daysLate,
                        overdueFee: overdueFeeFormula,
                        paid: false,
                        paidAt: null
                    }
                    try {
                        await LoanDelay.create(loanDelay)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }

            for (const delay of delays) {
                const loanId = await Loan.findById(delay.loanId)

                // verifica se o parametro de atraso está ativo
                if (schoolParams.params.loanDelay.active) {
                    // calcula quantos dias foram atrasados
                    let daysLate = Math.floor((new Date().getTime() - loanId.dueDate.getTime()) / (1000 * 60 * 60 * 24))
                    // calcula a multa
                    let fineValue = schoolParams.params.loanDelay.fineValue
                    let dailyRate = schoolParams.params.loanDelay.dailyRate
                    // fórmula de cálculo da multa: valor da multa + (dias de atraso * (taxa diária / 100) * valor da multa) 
                    let overdueFee = Math.ceil(fineValue + ((daysLate * (dailyRate / 100)) * fineValue))

                    try {
                        // atualiza a multa e os dias atrasados
                        await LoanDelay.findByIdAndUpdate(delay._id, { overdueDays: daysLate, overdueFee: overdueFee })
                    } catch (error) {
                        console.log(error)
                    }
                }
            }

            return { valid: true, message: 'Empréstimos vencidos atualizados com sucesso!' }
        } catch (error) {
            return { valid: false, message: 'Erro ao atualizar empréstimos vencidos!', err: error }
        }
    }

    async existingLoanDelay(loanDelayData) {
        try {
            const loanDelay = await LoanDelay.findOne({
                _id: loanDelayData.id
            })
            .populate('loanId', 'code dueDate' )
            if (!loanDelay) {
                return {
                    valid: false,
                    message: 'Multa não cadastrada',
                    err: 'loan-delay-not-registered'
                }
            }
            return {
                valid: true,
                loanDelay
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar multa',
                err: error.message
            }
        }
    }

    async getLoanDelayById(loanDelayData) {
        const existingLoanDelay = await this.existingLoanDelay(loanDelayData)
        if (existingLoanDelay && !existingLoanDelay.valid) {
            return existingLoanDelay
        }
        return {
            valid: true,
            loanDelay: existingLoanDelay.loanDelay
        }
    }

    async updateLoanDelay(loanDelayData) {
        const existingLoanDelay = await this.existingLoanDelay(loanDelayData)
        if (existingLoanDelay && !existingLoanDelay.valid) {
            return existingLoanDelay
        }

        if (existingLoanDelay.loanDelay.paid) {
            return {
                valid: false,
                message: 'Esta multa já foi paga',
                err: 'loan-delay-already-paid'
            }
        }

        if (loanDelayData.paid === true || loanDelayData.paid === 'true') {
            if (new Date(loanDelayData.paidAt).getTime() < existingLoanDelay.loanDelay.loanId.dueDate.getTime()) {
                return {
                    valid: false,
                    message: 'Data de pagamento deve ser maior que a data de vencimento da multa',
                    err: 'invalid-paid-at'
                }
            }
        }

        const loanDelay = existingLoanDelay.loanDelay
            loanDelay.set({
                paid: loanDelayData.paid,
                paidAt: loanDelayData.paidAt
            })

        try {
            const updatedLoanDelay = await loanDelay.save()
            if (updatedLoanDelay.paid === true) {
                await Loan.findByIdAndUpdate(existingLoanDelay.loanDelay.loanId._id, { status: 'active', dueDate: loanDelayData.paidAt })
            }
            return {
                valid: true,
                message: 'Multa atualizada com sucesso',
                loanDelay: updatedLoanDelay
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar multa',
                err: error.message
            }
        }
    }
}