// models
    const Publisher = require('../models/Book/Publisher')
    const Author = require('../models/Book/Author')
    const Genre = require('../models/Book/Genre')

// helpers


module.exports = class BookService {

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

        const publisher = new Publisher({
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

    async getAllPublishers() {
        try {
            const publishers = await Publisher.find()
            return {
                valid: true,
                publishers
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

        const author = new Author({
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

    async getAllAuthors() {
        try {
            const authors = await Author.find()
            return {
                valid: true,
                authors
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
            const genre = await Genre.findById(genreData.id)
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

        const genre = new Genre({
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

    async getAllGenres() {
        try {
            const genres = await Genre.find()
            return {
                valid: true,
                genres
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

}