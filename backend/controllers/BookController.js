const BookService = require('../services/BookService')
const bookService = new BookService()

const emptyBody = require('../helpers/emptyBody')
const emptyFields = require('../helpers/emptyFields')
const validateID = require('../helpers/validateID')

module.exports = class BookController {

    static async createAuthor(req, res) {
        emptyBody(req, res)

        const { name } = req.body

        const reqFields = emptyFields({
            required: ['name'],
            labels: {
                name: 'Nome'
            }
        })
        const ok = reqFields(req, res)
        if (!ok) return

        const result = await bookService.createAuthor({ name })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        }
        return res.status(201).json({
            message: result.message
        })
    }

    static async getAllAuthors(req, res) {
        try {
            const result = await bookService.getAllAuthors()
            if (!result.valid) {
                return res.status(400).json({
                    message: result.message,
                    err: result.err
                })
            }
            return res.status(200).json({ authors: result.authors })
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar autores', err: error })
        }
    }

    static async getAuthorById(req, res) {
        const { id } = req.params
        validateID(id, res)

        const result = await bookService.getAuthorById(id)

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        }
        return res.status(200).json({ author: result.author })
    }

    static async deleteAuthorById(req, res) {
        const { id } = req.params
        validateID(id, res)

        const result = await bookService.deleteAuthorById(id)

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        }
        return res.status(200).json({ message: result.message })
    }

    static async updateAuthor(req, res) {
        const { id } = req.params
        validateID(id, res)
        emptyBody(req, res)

        const { name } = req.body

        const reqFields = emptyFields({
            required: ['name'],
            labels: {
                name: 'Nome'
            }
        })
        const ok = reqFields(req, res)
        if (!ok) return

        const result = await bookService.updateAuthor({
            id,
            name
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        }
        return res.status(200).json({
            message: result.message
        })
    }
}
