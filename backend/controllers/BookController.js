// services
const BookService = require('../services/BookService')
const bookService = new BookService()

// helpers
const emptyBody = require('../helpers/emptyBody') // verifica se o body está vazio
const emptyFields = require('../helpers/emptyFields') // verifica se os campos obrigatórios estão preenchidos
const validateID = require('../helpers/validateID') // verifica se o ID é válido
const validateBooleanFields = require('../helpers/validateBooleanFields') // verifica se campos booleanos sao válidos
const validateEmail = require('../helpers/validateEmail') // verifica se o email é válido
const validatePhone = require('../helpers/validatePhone') // verifica se o telefone é válido
const isDate = require('../helpers/isDate') // verifica se a data é válida
const validator = require('validator')

module.exports = class BookController {
    // ------------------------ criação de editora ------------------------ //
    static async registerPublisher(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { name } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name'],
            labels: {
                name: 'Nome',
            }
        }
        const reqFields = emptyFields(fieldsConfig)
        const fieldsValidation = reqFields(req)
        if (!fieldsValidation.valid) {
            return res.status(fieldsValidation.status).json({
                message: fieldsValidation.message,
                err: fieldsValidation.err
            })
        }

        const result = await bookService.registerPublisher({
            name
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                publisher: result.publisher
            })
        }
    }

    static async getAllPublishers(req, res) {
        const result = await bookService.getAllPublishers()
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                publishers: result.publishers
            })
        }
    }

    static async getPublisher(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await bookService.getPublisher({
            id
        })
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                publisher: result.publisher
            })
        }
    }

    static async editPublisher(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { id } = req.params

        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const { name } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name'],
            labels: {
                name: 'Nome',
            }
        }
        const reqFields = emptyFields(fieldsConfig)
        const fieldsValidation = reqFields(req)
        if (!fieldsValidation.valid) {
            return res.status(fieldsValidation.status).json({
                message: fieldsValidation.message,
                err: fieldsValidation.err
            })
        }

        const result = await bookService.editPublisher({
            id,
            name
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                publisher: result.publisher
            })
        }
    }

    static async deletePublisher(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await bookService.deletePublisher({
            id
        })
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                publisher: result.publisher
            })
        }
    }


    // ------------------------ criação de autores ------------------------ //
    static async registerAuthor(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { name } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name'],
            labels: {
                name: 'Nome',
            }
        }
        const reqFields = emptyFields(fieldsConfig)
        const fieldsValidation = reqFields(req)
        if (!fieldsValidation.valid) {
            return res.status(fieldsValidation.status).json({
                message: fieldsValidation.message,
                err: fieldsValidation.err
            })
        }

        const result = await bookService.registerAuthor({
            name
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                author: result.author
            })
        }
    }

    static async getAllAuthors(req, res) {
        const result = await bookService.getAllAuthors()
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                authors: result.authors
            })
        }
    }

    static async getAuthor(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }
        const result = await bookService.getAuthor({
            id
        })
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                author: result.author
            })
        }
    }

    static async editAuthor(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { id } = req.params

        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const { name } = req.body

        const fieldsConfig = {
            required: ['name'],
            labels: {
                name: 'Nome',
            }
        }
        const reqFields = emptyFields(fieldsConfig)
        const fieldsValidation = reqFields(req)
        if (!fieldsValidation.valid) {
            return res.status(fieldsValidation.status).json({
                message: fieldsValidation.message,
                err: fieldsValidation.err
            })
        }

        const result = await bookService.editAuthor({
            id,
            name
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                author: result.author
            })
        }
    }

    static async deleteAuthor(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await bookService.deleteAuthor({
            id
        })
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                author: result.author
            })
        }
    }

}