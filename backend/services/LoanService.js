// models
    const Loan = require('../models/Loan/Loans')
    const BookCopy = require('../models/Book/BookCopy')
    const Book = require('../models/Book/Book')
    const User = require('../models/User/User')
    const Member = require('../models/Library/Member')

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

            return {
                valid: true,
                loans,
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

}