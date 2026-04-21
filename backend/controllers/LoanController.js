// services
const LoanService = require('../services/LoanService')
const loanService = new LoanService()

// helpers
const emptyBody = require('../helpers/emptyBody') // verifica se o body está vazio
const emptyFields = require('../helpers/emptyFields') // verifica se os campos obrigatórios estão preenchidos
const validateID = require('../helpers/validateID') // verifica se o ID é válido
const validateBooleanFields = require('../helpers/validateBooleanFields') // verifica se campos booleanos sao válidos
const validateEmail = require('../helpers/validateEmail') // verifica se o email é válido
const validatePhone = require('../helpers/validatePhone') // verifica se o telefone é válido
const isDate = require('../helpers/isDate') // verifica se a data é válida
const validateObjectIds = require('../helpers/validateObjectIds') // verifica se os IDs são válidos
const validator = require('validator')

module.exports = class LoanController {
    
    // ------------------------ criação de empréstimos ------------------------ //
    static async registerLoan(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { copyId, memberId, operatorId, notes, loanDate, dueDate } = req.body
        const status = "active" // status inicial do empréstimo
        const returnDate = null // data de devolução
        const conditionIn = null // condição final do exemplar

        const fielsConfig = {
            required: ['copyId', 'memberId', 'operatorId', 'loanDate', 'dueDate'],
            labels: {
                copyId: 'Código do exemplar',
                memberId: 'ID do membro',
                operatorId: 'ID do operador',
                loanDate: 'Data de empréstimo',
                dueDate: 'Data de vencimento',
            }
        }

        const reqFields = emptyFields(fielsConfig)
        const fieldsValidation = reqFields(req)
        if (!fieldsValidation.valid) {
            return res.status(fieldsValidation.status).json({
                message: fieldsValidation.message,
                err: fieldsValidation.err
            })
        }

        // verifica se os IDs são válidos
        const objectIdValidation = validateObjectIds({
            objects: ['copyId', 'memberId', 'operatorId'],
            labels: {
                copyId: 'Código do exemplar',
                memberId: 'ID do membro',
                operatorId: 'ID do operador'
            }
        })
        const okIds = objectIdValidation(req, res)
        if (!okIds) return

        // verifica as datas
        const dates = isDate({
            dates: ['loanDate', 'dueDate'],
            labels: {
                loanDate: 'Data de empréstimo',
                dueDate: 'Data de vencimento',
            }
        })
        
        const datesValidation = dates(req)
        if (!datesValidation.valid) {
            return res.status(datesValidation.status).json({
                message: datesValidation.message,
                err: datesValidation.err
            })
        }

        // verificação de data de vencimento
        if (loanDate > dueDate) {
            return res.status(400).json({
                message: 'Data de vencimento deve ser maior que a data de empréstimo',
                err: 'invalid-due-date'
            })
        }

        const result = await loanService.registerLoan({
            copyId,
            memberId,
            operatorId,
            notes,
            loanDate,
            dueDate,
            status,
            returnDate,
            conditionIn
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                loan: result.loan
            })
        }

    }

}