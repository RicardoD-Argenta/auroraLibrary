// models
    const Loan = require('../models/Loan/Loans')
    const BookCopy = require('../models/Book/BookCopy')

// imports
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

        const loan = new Loan({
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

    async allLoans() {
        try {
            const loans = await Loan.find({ status: 'active' })
                .sort({ createdAt: -1 })
            return {
                valid: true,
                loans
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
        const existingLoan = await this.existingLoan(loanData)
        if (!existingLoan.valid) {
            return existingLoan
        }
        return {
            valid: true,
            loan: existingLoan.loan
        }
    }
}