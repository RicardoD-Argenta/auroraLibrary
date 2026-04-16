const BookService = require('../services/BookService')
const bookService = new BookService()

const emptyBody = require('../helpers/emptyBody')
const emptyFields = require('../helpers/emptyFields')
const validateID = require('../helpers/validateID')

module.exports = class BookController {

    // ------------------------ GÊNEROS ------------------------ //

    static async createGenre(req, res) {
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

        const result = await bookService.createGenre({ name })

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

    static async getAllGenres(req, res) {
        try {
            const result = await bookService.getAllGenres()
            if (!result.valid) {
                return res.status(400).json({
                    message: result.message,
                    err: result.err
                })
            }
            return res.status(200).json({ genres: result.genres })
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar gêneros', err: error })
        }
    }

    static async getGenreById(req, res) {
        const { id } = req.params
        validateID(id, res)

        const result = await bookService.getGenreById(id)

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        }
        return res.status(200).json({ genre: result.genre })
    }

    static async deleteGenreById(req, res) {
        const { id } = req.params
        validateID(id, res)

        const result = await bookService.deleteGenreById(id)

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        }
        return res.status(200).json({ message: result.message })
    }

    static async updateGenre(req, res) {
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

        const result = await bookService.updateGenre({ id, name })

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
