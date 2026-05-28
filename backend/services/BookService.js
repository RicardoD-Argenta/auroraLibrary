// models
    const Publisher = require('../models/Book/Publisher')
    const Author = require('../models/Book/Author')
    const Genre = require('../models/Book/Genre')
    const Book = require('../models/Book/Book')
    const BookCopy = require('../models/Book/BookCopy')
    const Sector = require('../models/Library/Sector')
    const Shelf = require('../models/Library/Shelf')
    const Loan = require('../models/Loan/Loans')

// imports
    const LibraryService = require('./LibraryService')
    const libraryService = new LibraryService()

// helpers
    const Counter = require('../models/Counter')


module.exports = class BookService {

    // gambiarra q nem lembro pra q serve, entretanto NÃO REMOVER
    normalizeOptionalObjectId(value) {
        if (typeof value !== 'string') {
            return value || null
        }

        const trimmedValue = value.trim()
        return trimmedValue || null
    }

    async registeredPublisher(publisherData) {
        try {
            const publisher = await Publisher.findOne({
                $or: [
                    { name: publisherData.name },
                ], _id: { $ne: publisherData.id }
            })
            if (publisher) {
                return {
                    valid: false,
                    message: 'Editora já cadastrada',
                    err: 'publisher-already-registered'
                }
            }
        }
        catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar editora',
                err: error.message
            }
        }
    }

    async existingPublisher(publisherData) {
        try {
            const publisher = await Publisher.findOne({
                _id: publisherData.id
            })
            if (!publisher) {
                return {
                    valid: false,
                    message: 'Editora não cadastrada',
                    err: 'publisher-not-registered'
                }
            }
            return {
                valid: true,
                publisher
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao verificar editora',
                err: error.message
            }
        }
    }

    async registerPublisher(publisherData) {
        // verifica se o editora já está cadastrado
        const registeredPublisher = await this.registeredPublisher(publisherData)
        if (registeredPublisher && !registeredPublisher.valid) {
            return registeredPublisher
        }

        const code = await Counter.nextSequence('publisher')

        const publisher = new Publisher({
            code,
            name: publisherData.name
        })
        try {
            const newPublisher = await publisher.save()
            return {
                valid: true,
                message: 'Editora cadastrada com sucesso',
                publisher: newPublisher
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar editora',
                err: error.message
            }
        }
    }

    async getAllPublishers({ page = 1, search = '' } = {}) {
        try {
            const limit = 12
            const skip = (page - 1) * limit

            const query = search
                ? { $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { code: { $regex: search, $options: 'i' } }
                ] }
                : {}

            const publishers = await Publisher.find(query).skip(skip).limit(limit)
            const total = await Publisher.countDocuments(query)

            return {
                valid: true,
                publishers,
                total,
                pages: Math.ceil(total / limit)
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar editoras',
                err: error.message
            }
        }
    }

    async getPublisher(publisherData) {
        const existingPublisher = await this.existingPublisher(publisherData)
        if (existingPublisher && !existingPublisher.valid) {
            return existingPublisher
        }
        return {
            valid: true,
            publisher: existingPublisher.publisher
        }
    }

    async editPublisher(publisherData) {
        const existingPublisher = await this.existingPublisher(publisherData)
        if (existingPublisher && !existingPublisher.valid) {
            return existingPublisher
        }

        const registeredPublisher = await this.registeredPublisher(publisherData)
        if (registeredPublisher && !registeredPublisher.valid) {
            return registeredPublisher
        }

        const publisher = existingPublisher.publisher
        publisher.set({
            name: publisherData.name
        })

        try {
            const updatedPublisher = await publisher.save()
            return {
                valid: true,
                message: 'Editora atualizada com sucesso',
                publisher: updatedPublisher
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar editora',
                err: error.message
            }
        }
    }

    async deletePublisher(publisherData) {
        const existingPublisher = await this.existingPublisher(publisherData)
        if (existingPublisher && !existingPublisher.valid) {
            return existingPublisher
        }

        const bookWithPublisher = await Book.findOne({ publisherId: existingPublisher.publisher._id })
        if (bookWithPublisher) {
            return {
                valid: false,
                message: 'Não é possível excluir a editora pois existem livros cadastrados',
                err: 'publisher-has-books'
            }
        }

        try {
            await Publisher.findByIdAndDelete(existingPublisher.publisher._id)
            return {
                valid: true,
                message: 'Editora excluída com sucesso'
            }
        }
        catch (error) {
            return {
                valid: false,
                message: 'Erro ao excluir editora',
                err: error.message
            }
        }
    }

    // ------------------------ criação de autores ------------------------ //
    async registeredAuthor(authorData) {
        try {
            const author = await Author.findOne({
                $or: [
                    { name: authorData.name },
                ], _id: { $ne: authorData.id }
            })
            if (author) {
                return {
                    valid: false,
                    message: 'Autor já cadastrado',
                    err: 'author-already-registered'
                }
            }
        } catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar autor',
                err: error.message
            }
        }
    }

    async existingAuthor(authorData) {
        try {
            const author = await Author.findById(authorData.id)
            if (!author) {
                return {
                    valid: false,
                    message: 'Autor não cadastrado',
                    err: 'author-not-registered'
                }
            }
            return {
                valid: true,
                author
            }
        } catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar autor',
                err: error.message
            }
        }
    }

    async registerAuthor(authorData) {
        const registeredAuthor = await this.registeredAuthor(authorData)
        if (registeredAuthor && !registeredAuthor.valid) {
            return registeredAuthor
        }

        const code = await Counter.nextSequence('author')

        const author = new Author({
            code,
            name: authorData.name
        })
        try {
            const newAuthor = await author.save()
            return {
                valid: true,
                message: 'Autor cadastrado com sucesso',
                author: newAuthor
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar autor',
                err: error.message
            }
        }
    }

    async getAllAuthors({ page = 1, search = '' } = {}) {
        try {
            const limit = 12
            const skip = (page - 1) * limit

            const query = search
                ? { $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { code: { $regex: search, $options: 'i' } }
                ] }
                : {}

            const authors = await Author.find(query).skip(skip).limit(limit)
            const total = await Author.countDocuments(query)


            return {
                valid: true,
                authors,
                total,
                pages: Math.ceil(total / limit)
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar autores',
                err: error.message
             }
        }
    }

    async getAuthor(authorData) {
        const existingAuthor = await this.existingAuthor(authorData)
        if (existingAuthor && !existingAuthor.valid) {
            return existingAuthor
        }
        return {
            valid: true,
            author: existingAuthor.author
        }
    }

    async editAuthor(authorData) {
        const existingAuthor = await this.existingAuthor(authorData)
        if (existingAuthor && !existingAuthor.valid) {
            return existingAuthor
        }

        const registeredAuthor = await this.registeredAuthor(authorData)
        if (registeredAuthor && !registeredAuthor.valid) {
            return registeredAuthor
        }

        const author = existingAuthor.author
        author.set({
            name: authorData.name
        })

        try {
            const updatedAuthor = await author.save()
            return {
                valid: true,
                message: 'Autor atualizado com sucesso',
                author: updatedAuthor
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar autor',
                err: error.message
             }
        }
    }

    async deleteAuthor(authorData) {
        const existingAuthor = await this.existingAuthor(authorData)
        if (existingAuthor && !existingAuthor.valid) {
            return existingAuthor
        }

        const existingBooks = await Book.find({ authorsId: existingAuthor.author._id })
        if (existingBooks.length > 0) {
            return {
                valid: false,
                message: 'Não é possível excluir o autor pois existem livros cadastrados',
                err: 'author-has-books'
            }
        }

        try {
            await Author.findByIdAndDelete(existingAuthor.author._id)
            return {
                valid: true,
                message: 'Autor excluído com sucesso'
             }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao excluir autor',
                err: error.message
            }
        }
    }


    // ------------------------ criação de gênero ------------------------ //
    async registeredGenre(genreData) {
        try {
            const genre = await Genre.findOne({
                $or: [
                    { name: genreData.name },
                ], _id: { $ne: genreData.id }
            })
            if (genre) {
                return {
                    valid: false,
                    message: 'Gênero já cadastrado',
                    err: 'genre-already-registered'
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao verificar gênero',
                err: error.message
            }
        }
    }

    async existingGenre(genreData) {
        try {
            const genre = await Genre.findById(genreData.id).populate('parentId', 'name code')
            if (!genre) {
                return {
                    valid: false,
                    message: 'Gênero não cadastrado',
                    err: 'genre-not-registered'
                }
            }
            return {
                valid: true,
                genre
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao verificar gênero',
                err: error.message
            }
        }
    }

    async hasSon(genreData) {
        try {
            const genre = await Genre.find(
                { parentId: genreData.id },
            )
            if (genre.length > 0) {
                return {
                    valid: true,
                    hasSon: true
                }
            }
            else {
                return {
                    valid: true,
                    hasSon: false
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao verificar gênero',
                err: error.message
            }
        }
    }

    async registerGenre(genreData) {
        const parentId = this.normalizeOptionalObjectId(genreData.parentId)

        const registeredGenre = await this.registeredGenre(genreData)
        if (registeredGenre && !registeredGenre.valid) {
            return registeredGenre
        }

        if (parentId) {
            const existingGenre = await this.existingGenre({
                id: parentId
            })
            if (existingGenre && !existingGenre.valid) {
                return existingGenre
            }
        }

        const code = await Counter.nextSequence('genre')

        const genre = new Genre({
            code,
            name: genreData.name,
            parentId
        })
        try {
            const newGenre = await genre.save()
            return {
                valid: true,
                message: 'Gênero cadastrado com sucesso',
                genre: newGenre
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar gênero',
                err: error.message
            }
        }
    }

    async getAllGenres({ page = 1, search = '' } = {}) {
        try {
            const limit = 12
            const skip = (page - 1) * limit

            const query = search
                ? (() => {
                    const regex = { $regex: search, $options: 'i' }
                    return { $or: [
                        { name: regex },
                        { code: regex },
                    ] }
                })()
                : {}

            if (search) {
                const parentMatches = await Genre.find({ name: { $regex: search, $options: 'i' } }, '_id')
                const parentIds = parentMatches.map(g => g._id)
                if (parentIds.length > 0) {
                    query.$or.push({ parentId: { $in: parentIds } })
                }
            }

            const genres = await Genre.find(query).skip(skip).limit(limit).populate('parentId', 'name code')
            const total = await Genre.countDocuments(query)

            return {
                valid: true,
                genres,
                pages: Math.ceil(total / limit)
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar gêneros',
                err: error.message
             }
        }
    }

    async getGenre(genreData) {
        const existingGenre = await this.existingGenre(genreData)
        if (existingGenre && !existingGenre.valid) {
            return existingGenre
        }
        return {
            valid: true,
            genre: existingGenre.genre
        }
    }

    async editGenre(genreData) {
        const parentId = this.normalizeOptionalObjectId(genreData.parentId)

        const existingGenre = await this.existingGenre(genreData)
        if (existingGenre && !existingGenre.valid) {
            return existingGenre
        }

        const registeredGenre = await this.registeredGenre(genreData)
        if (registeredGenre && !registeredGenre.valid) {
            return registeredGenre
        }

        if (parentId) {
            const existingGenreParent = await this.existingGenre({
                id: parentId
            })
            if (existingGenreParent && !existingGenreParent.valid) {
                return existingGenreParent
            }
        }

        if (parentId === genreData.id) {
            return {
                valid: false,
                message: 'Não é possível definir o gênero como pai dele mesmo'
            }
        }

        const genre = existingGenre.genre
        genre.set({
            name: genreData.name,
            parentId
        })

        try {
            const updatedGenre = await genre.save()
            return {
                valid: true,
                message: 'Gênero atualizado com sucesso',
                genre: updatedGenre
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar gênero',
                err: error.message
             }
        }
    }

    async deleteGenre(genreData) {
        const existingGenre = await this.existingGenre(genreData)
        if (existingGenre && !existingGenre.valid) {
            return existingGenre
        }

        const hasSon = await this.hasSon(genreData)

        if (hasSon && !hasSon.valid) {
            return hasSon
        }
        else if (hasSon && hasSon.hasSon) {
            return {
                valid: false,
                message: 'Não é possível excluir um gênero com filhos'
            }
        }

        const existingBooks = await Book.find({ genresId: existingGenre.genre._id })
        if (existingBooks.length > 0) {
            return {
                valid: false,
                message: 'Não é possível excluir o gênero pois existem livros cadastrados',
                err: 'genre-has-books'
            }
        }

        try {
            await Genre.findByIdAndDelete(existingGenre.genre._id)
            return {
                valid: true,
                message: 'Gênero excluído com sucesso'
             }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao excluir gênero',
                err: error.message
            }
        }
    }


    // ------------------------ criação de livro ------------------------ //
    async registeredBook(bookData) {
        try {
            const book = await Book.findOne({
                $or: [
                    { title: bookData.title },
                    { isbn: bookData.isbn },
                ],
                _id: { $ne: bookData.id }
            })
            if (book) {
                const reason = book.isbn === bookData.isbn ? 'ISBN já cadastrado' : 'Título já cadastrado'
                return {
                    valid: false,
                    message: reason,
                    err: 'book-already-registered'
                }
            }
            else {
                return {
                    valid: true,
                    book
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao verificar livro',
                err: error.message
            }
        }
    }

    async existingBook(bookData) {
        try {
            const book = await Book.findById(bookData.id)
            if (!book) {
                return {
                    valid: false,
                    message: 'Livro não cadastrado',
                    err: 'book-not-registered'
                }
            }
            else {
                return {
                    valid: true,
                    book
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao verificar livro',
                err: error.message
            }
        }
    }

    async registerBook(bookData) {
        const registeredBook = await this.registeredBook(bookData)
        if (registeredBook && !registeredBook.valid) {
            return registeredBook
        }

        const publisher = await this.existingPublisher({
            id: bookData.publisherId
        })
        if (publisher && !publisher.valid) {
            return publisher
        }

        for (const authorId of bookData.authorsId) {
            const author = await this.existingAuthor({
                id: authorId
            })
            if (author && !author.valid) {
                return author
            }
        }
        
        for (const genreId of bookData.genresId) {
            const genre = await this.existingGenre({
                id: genreId
            })
            if (genre && !genre.valid) {
                return genre
            }
        }

        const code = await Counter.nextSequence('book')

        const book = new Book({
            code,
            title: bookData.title,
            subtitle: bookData.subtitle,
            authorsId: bookData.authorsId,
            publisherId: bookData.publisherId,
            genresId: bookData.genresId,
            language: bookData.language,
            isbn: bookData.isbn,
            edition: bookData.edition,
            year: bookData.year,
            pages: bookData.pages,
            description: bookData.description,
            coverUrl: bookData.coverUrl
        })

        try {
            const newBook = await book.save()
            return {
                valid: true,
                message: 'Livro cadastrado com sucesso',
                book: newBook
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar o livro',
                err: error.message
            }
        }
    }

    async getAllBooks(page = 1, search = '') {
        try {
            const limit = 12
            const skip = (page - 1) * limit

            let query = {}

            if (search) {
                const regex = { $regex: search, $options: 'i' }

                const [authorMatches, publisherMatches, genreMatches] = await Promise.all([
                    Author.find({ name: regex }, '_id'),
                    Publisher.find({ name: regex }, '_id'),
                    Genre.find({ name: regex }, '_id'),
                ])

                query.$or = [
                    { title: regex },
                    { subtitle: regex },
                    { language: regex },
                    { isbn: regex },
                    { edition: regex },
                    { year: regex },
                    { description: regex },
                    { authorsId: { $in: authorMatches.map(a => a._id) } },
                    { publisherId: { $in: publisherMatches.map(p => p._id) } },
                    { genresId: { $in: genreMatches.map(g => g._id) } },
                ]
            }

            const books = await Book.find(query)
                .populate('authorsId', 'name')
                .populate('publisherId', 'name')
                .populate('genresId', 'name')
                .skip(skip)
                .limit(limit)
            const total = await Book.countDocuments(query)

            return {
                valid: true,
                books,
                total,
                pages: Math.ceil(total / limit)
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar os livros',
                err: error.message
             }
        }
    }

    async getBook(bookData) {
        const existingBook = await this.existingBook(bookData)
        if (existingBook && !existingBook.valid) {
            return existingBook
        }
        const book = await Book.findById(bookData.id)
            .populate('authorsId', 'name')
            .populate('publisherId', 'name')
            .populate('genresId', 'name')
        return {
            valid: true,
            book
        }
    }

    async editBook(bookData) {
        const existingBook = await this.existingBook(bookData)
        if (existingBook && !existingBook.valid) {
            return existingBook
        }

        const registeredBook = await this.registeredBook(bookData)
        if (registeredBook && !registeredBook.valid) {
            return registeredBook
        }

        const publisher = await this.existingPublisher({
            id: bookData.publisherId
        })
        if (publisher && !publisher.valid) {
            return publisher
        }

        for (const authorId of bookData.authorsId) {
            const author = await this.existingAuthor({
                id: authorId
            })
            if (author && !author.valid) {
                return author
            }
        }
        
        for (const genreId of bookData.genresId) {
            const genre = await this.existingGenre({
                id: genreId
            })
            if (genre && !genre.valid) {
                return genre
            }
        }

        const book = existingBook.book
        book.set({
            title: bookData.title,
            subtitle: bookData.subtitle,
            authorsId: bookData.authorsId,
            publisherId: bookData.publisherId,
            genresId: bookData.genresId,
            language: bookData.language,
            isbn: bookData.isbn,
            edition: bookData.edition,
            year: bookData.year,
            pages: bookData.pages,
            description: bookData.description,
            coverUrl: bookData.coverUrl
        })

        try {
            const updatedBook = await book.save()
            return {
                valid: true,
                message: 'Livro atualizado com sucesso',
                book: updatedBook
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar o livro',
                err: error.message
            }
        }
    }

    async deleteBook(bookData) {
        const existingBook = await this.existingBook(bookData)
        if (existingBook && !existingBook.valid) {
            return existingBook
        }

        const existingBookCopies = await BookCopy.find({ bookId: existingBook.book._id })
        if (existingBookCopies.length > 0) {
            return {
                valid: false,
                message: 'Não é possível excluir o livro pois existem exemplares cadastrados',
                err: 'book-has-copies'
            }
        }

        try {
            await Book.findByIdAndDelete(existingBook.book._id)
            return {
                valid: true,
                message: 'Livro excluído com sucesso'
             }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao excluir o livro',
                err: error.message
            }
        }
    }


    // ------------------------ criação de exemplares ------------------------ //
    async registeredBookCopy(bookCopyData) {
        try {
            const bookCopy = await BookCopy.findOne({
                bookId: bookCopyData.bookId,
                copycode: bookCopyData.copycode,
                _id: { $ne: bookCopyData.id }
            })
            if (bookCopy) {
                return {
                    valid: false,
                    message: 'Exemplar já cadastrado',
                    err: 'book-copy-already-registered'
                }
            }
            else {
                return {
                    valid: true,
                    bookCopy
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao verificar exemplar',
                err: error.message
            }
        }
    }

    async existingBookCopy(bookCopyData) {
        try {
            const bookCopy = await BookCopy.findById(bookCopyData.id)
            if (!bookCopy) {
                return {
                    valid: false,
                    message: 'Exemplar não cadastrado',
                    err: 'book-copy-not-registered'
                }
            }
            else {
                return {
                    valid: true,
                    bookCopy
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao verificar exemplar',
                err: error.message
            }
        }
    }

    async checkIfLoanIsActive(bookCopyData) {
        try {
            const activeLoan = await Loan.findOne({
                copyId: bookCopyData.id,
                status: { $in: ['active', 'overdue', 'lost'] },
            })
            if (activeLoan) {
                return {
                    valid: false,
                    message: 'Já existe um empréstimo ativo para este exemplar',
                    err: 'loan-already-active'
                }
            }
            else {
                return {
                    valid: true,
                    loan: activeLoan
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao verificar exemplar',
                err: error.message
            }
        }
    }

    async registerBookCopy(bookCopyData) {
        const registeredBookCopy = await this.registeredBookCopy(bookCopyData)
        if (registeredBookCopy && !registeredBookCopy.valid) {
            return registeredBookCopy
        }

        const book = await this.existingBook({
            id: bookCopyData.bookId
        })
        if (book && !book.valid) {
            return book
        }

        const sector = await libraryService.existingSector({
            id: bookCopyData.sectorId
        })
        if (sector && !sector.valid) {
            return sector
        }

        const shelf = await libraryService.existingShelf({
            id: bookCopyData.shelfId
        })
        if (shelf && !shelf.valid) {
            return shelf
        }

        const code = await Counter.nextSequence('bookcopy')

        const bookCopy = new BookCopy({
            code,
            bookId: bookCopyData.bookId,
            sectorId: bookCopyData.sectorId,
            shelfId: bookCopyData.shelfId,
            copycode: bookCopyData.copycode,
            status: bookCopyData.status,
            condition: bookCopyData.condition,
            acquireAt: bookCopyData.acquireAt,
            notes: bookCopyData.notes
        })

        try {
            const newBookCopy = await bookCopy.save()
            return {
                valid: true,
                message: 'Exemplar cadastrado com sucesso',
                bookCopy: newBookCopy
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar o exemplar',
                err: error.message
            }
        }
    }

    async getAllBookCopies({ page = 1, search = '', status = '', condition = '' } = {}) {
        try {
            const limit = 12
            const skip = (page - 1) * limit

            let query = {}

            if (status) query.status = status
            if (condition) query.condition = condition

            if (search) {
                const regex = { $regex: search, $options: 'i' }

                const [authorMatches, publisherMatches, genreMatches, sectorMatches, shelfMatches] = await Promise.all([
                    Author.find({ name: regex }, '_id'),
                    Publisher.find({ name: regex }, '_id'),
                    Genre.find({ name: regex }, '_id'),
                    Sector.find({ name: regex }, '_id'),
                    Shelf.find({ name: regex }, '_id'),
                ])

                const bookQuery = {
                    $or: [
                        { title: regex },
                        { subtitle: regex },
                        { language: regex },
                        { isbn: regex },
                        { edition: regex },
                        { year: regex },
                        { description: regex },
                        { authorsId: { $in: authorMatches.map(a => a._id) } },
                        { publisherId: { $in: publisherMatches.map(p => p._id) } },
                        { genresId: { $in: genreMatches.map(g => g._id) } },
                    ]
                }
                const bookMatches = await Book.find(bookQuery, '_id')

                query.$or = [
                    { code: regex },
                    { copycode: regex },
                    { status: regex },
                    { condition: regex },
                    { notes: regex },
                    { bookId: { $in: bookMatches.map(b => b._id) } },
                    { sectorId: { $in: sectorMatches.map(s => s._id) } },
                    { shelfId: { $in: shelfMatches.map(s => s._id) } },
                ]
            }

            const bookCopies = await BookCopy.find(query)
                .populate({
                    path: 'bookId',
                    populate: [
                        { path: 'authorsId', select: 'name' },
                        { path: 'publisherId', select: 'name' },
                        { path: 'genresId', select: 'name' },
                    ]
                })
                .populate('sectorId', 'name')
                .populate('shelfId', 'name')
                .skip(skip)
                .limit(limit)
            const total = await BookCopy.countDocuments(query)

            return {
                valid: true,
                bookCopies,
                total,
                pages: Math.ceil(total / limit)
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar exemplares',
                err: error.message
             }
        }
    }

    async getBookCopy(bookCopyData) {
        const existingBookCopy = await this.existingBookCopy(bookCopyData)
        if (existingBookCopy && !existingBookCopy.valid) {
            return existingBookCopy
        }
        const bookCopy = await BookCopy.findById(existingBookCopy.bookCopy._id)
            .populate({
                path: 'bookId',
                populate: [
                    { path: 'authorsId', select: 'name' },
                    { path: 'publisherId', select: 'name' },
                    { path: 'genresId', select: 'name' },
                ]
            })
            .populate('sectorId', 'name code')
            .populate('shelfId', 'name code')
        return {
            valid: true,
            bookCopy
        }
    }

    async editBookCopy(bookCopyData) {
        const existingBookCopy = await this.existingBookCopy(bookCopyData)
        if (existingBookCopy && !existingBookCopy.valid) {
            return existingBookCopy
        }

        const registeredBookCopy = await this.registeredBookCopy(bookCopyData)
        if (registeredBookCopy && !registeredBookCopy.valid) {
            return registeredBookCopy
        }

        const book = await this.existingBook({
            id: bookCopyData.bookId
        })
        if (book && !book.valid) {
            return book
        }

        const sector = await libraryService.existingSector({
            id: bookCopyData.sectorId
        })
        if (sector && !sector.valid) {
            return sector
        }

        const shelf = await libraryService.existingShelf({
            id: bookCopyData.shelfId
        })
        if (shelf && !shelf.valid) {
            return shelf
        }

        const loan = await this.checkIfLoanIsActive(bookCopyData)
        if (loan && !loan.valid) {
            return loan
        }

        const bookCopy = existingBookCopy.bookCopy
        bookCopy.set({
            bookId: bookCopyData.bookId,
            sectorId: bookCopyData.sectorId,
            shelfId: bookCopyData.shelfId,
            copycode: bookCopyData.copycode,
            status: bookCopyData.status,
            condition: bookCopyData.condition,
            acquireAt: bookCopyData.acquireAt,
            notes: bookCopyData.notes
        })

        try {
            const updatedBookCopy = await bookCopy.save()
            return {
                valid: true,
                message: 'Exemplar atualizado com sucesso',
                bookCopy: updatedBookCopy
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar o exemplar',
                err: error.message
            }
        }
    }

    async deleteBookCopy(bookCopyData) {
        const existingBookCopy = await this.existingBookCopy(bookCopyData)
        if (existingBookCopy && !existingBookCopy.valid) {
            return existingBookCopy
        }

        const loan = await this.checkIfLoanIsActive(bookCopyData)
        if (loan && !loan.valid) {
            return loan
        }

        try {
            await BookCopy.findByIdAndDelete(existingBookCopy.bookCopy._id)
            return {
                valid: true,
                message: 'Exemplar excluído com sucesso'
             }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao excluir o exemplar',
                err: error.message
            }
        }
    }

}