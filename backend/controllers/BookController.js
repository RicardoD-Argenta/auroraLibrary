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
const validateObjectIds = require('../helpers/validateObjectIds') // verifica se os IDs são válidos
const validateYear = require('../helpers/validateYear') // verifica se o ano é válido
const validateISBN = require('../helpers/validateISBN') // verifica se o ISBN é válido
const validator = require('validator')
const { validate } = require('../models/Book/Publisher')

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


    // ------------------------ criação de gênero ------------------------ //
    static async registerGenre(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { name, parentId } = req.body
        const normalizedParentId = typeof parentId === 'string' ? parentId.trim() : parentId
        const sanitizedParentId = normalizedParentId || null

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

        if (sanitizedParentId) {
            const objectIdValidation = validateObjectIds({
                objects: ['parentId'],
                labels: {
                    parentId: 'ID do gênero pai'
                }
            })
            req.body.parentId = sanitizedParentId
            const objectIdsValidation = objectIdValidation(req, res)
            if (!objectIdsValidation) return
        }

        const result = await bookService.registerGenre({
            name,
            parentId: sanitizedParentId
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                genre: result.genre
            })
        }
    }

    static async getAllGenres(req, res) {
        const result = await bookService.getAllGenres()
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                genres: result.genres
            })
        }
    }

    static async getGenre(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await bookService.getGenre({
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
                genre: result.genre
            })
        }
    }

    static async editGenre(req, res) {
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

        const { name, parentId } = req.body
        const normalizedParentId = typeof parentId === 'string' ? parentId.trim() : parentId
        const sanitizedParentId = normalizedParentId || null

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

        if (sanitizedParentId) {
            const objectIdValidation = validateObjectIds({
                objects: ['parentId'],
                labels: {
                    parentId: 'ID do gênero pai'
                }
            })
            req.body.parentId = sanitizedParentId
            const objectIdsValidation = objectIdValidation(req, res)
            if (!objectIdsValidation) return
        }

        const result = await bookService.editGenre({
            id,
            name,
            parentId: sanitizedParentId
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                genre: result.genre
            })
        }
    }

    static async deleteGenre(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await bookService.deleteGenre({
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
                genre: result.genre
            })
        }
    }


    // ------------------------ criação de livro ------------------------ //
    static async registerBook(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }
        
        const { title, subtitle, authorsId, publisherId, genresId, language, isbn, edition, year, pages, description, coverUrl } = req.body

        const fieldsConfig = {
            required: ['title', 'authorsId', 'publisherId', 'genresId', 'language', 'isbn', 'year', 'pages'],
            labels: {
                title: 'Título',
                subtitle: 'Subtítulo',
                authorsId: 'ID do(s) autor(es)',
                publisherId: 'ID da editora',
                genresId: 'ID do(s) gênero(s)',
                language: 'Idioma',
                isbn: 'ISBN',
                edition: 'Edição',
                year: 'Ano',
                pages: 'Páginas',
                description: 'Descrição',
                coverUrl: 'URL da imagem/capa'
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

        // verifica se os IDs são válidos
        const objectIdValidation = validateObjectIds({
            objects: ['authorsId', 'publisherId', 'genresId'],
            labels: {
                authorsId: 'ID do(s) autor(es)',
                publisherId: 'ID da editora',
                genresId: 'ID do(s) gênero(s)'
            }
        })
        const okIds = objectIdValidation(req, res)
        if (!okIds) return

        // verifica se o ano é válido
        const resultYear = validateYear(year)
        if (!resultYear.valid) {
            return res.status(400).json({ message: resultYear.message, err: resultYear.err })
        }

        // verifica se o ISBN é válido
        const resultISBN = validateISBN(isbn)
        if (!resultISBN.valid) {
            return res.status(400).json({ message: resultISBN.message, err: resultISBN.err })
        }

        const verifPages = parseInt(pages)
        // verifica se a quantidade de páginas é válida
        if (isNaN(verifPages) || verifPages <= 0) {
            return res.status(400).json({ message: 'Número de páginas inválido', err: 'invalid-pages' })
        }
        

        const result = await bookService.registerBook({
            title,
            subtitle,
            authorsId,
            publisherId,
            genresId,
            language,
            isbn,
            edition,
            year,
            pages,
            description,
            coverUrl
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                book: result.book
            })
        }
    }

    static async getAllBooks(req, res) {
        const result = await bookService.getAllBooks()
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                books: result.books
            })
        }
    }

    static async getBook(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }
        const result = await bookService.getBook({
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
                book: result.book
            })
        }
    }

    static async editBook(req, res) {
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

        const { title, subtitle, authorsId, publisherId, genresId, language, isbn, edition, year, pages, description, coverUrl } = req.body

        const fieldsConfig = {
            required: ['title', 'authorsId', 'publisherId', 'genresId', 'language', 'isbn', 'year', 'pages'],
            labels: {
                title: 'Título',
                subtitle: 'Subtítulo',
                authorsId: 'ID do(s) autor(es)',
                publisherId: 'ID da editora',
                genresId: 'ID do(s) gênero(s)',
                language: 'Idioma',
                isbn: 'ISBN',
                edition: 'Edição',
                year: 'Ano',
                pages: 'Páginas',
                description: 'Descrição',
                coverUrl: 'URL da imagem/capa'
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

        // verifica se os IDs são válidos
        const objectIdValidation = validateObjectIds({
            objects: ['authorsId', 'publisherId', 'genresId'],
            labels: {
                authorsId: 'ID do(s) autor(es)',
                publisherId: 'ID da editora',
                genresId: 'ID do(s) gênero(s)'
            }
        })
        const okIds = objectIdValidation(req, res)
        if (!okIds) return

        // verifica se o ano é válido
        const resultYear = validateYear(year)
        if (!resultYear.valid) {
            return res.status(400).json({ message: resultYear.message, err: resultYear.err })
        }

        // verifica se o ISBN é válido
        const resultISBN = validateISBN(isbn)
        if (!resultISBN.valid) {
            return res.status(400).json({ message: resultISBN.message, err: resultISBN.err })
        }

        const verifPages = parseInt(pages)
        // verifica se a quantidade de páginas é válida
        if (isNaN(verifPages) || verifPages <= 0) {
            return res.status(400).json({ message: 'Número de páginas inválido', err: 'invalid-pages' })
        }
        

        const result = await bookService.editBook({
            id,
            title,
            subtitle,
            authorsId,
            publisherId,
            genresId,
            language,
            isbn,
            edition,
            year,
            pages,
            description,
            coverUrl
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                book: result.book
            })
        }
    }

    static async deleteBook(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await bookService.deleteBook({
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
                book: result.book
            })
        }
    }

}