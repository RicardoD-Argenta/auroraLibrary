const Author = require('../models/Book/Author')

module.exports = class BookService {

    async existingAuthor(authorData) {
        const existingAuthor = await Author.findOne({
            $or: [
                { name: authorData.name }
            ], _id: { $ne: authorData.id }
        })
        if (existingAuthor) {
            return { valid: false, message: 'Autor já cadastrado' }
        }
    }

    async createAuthor(authorData) {
        const existingAuthor = await this.existingAuthor(authorData)
        if (existingAuthor && !existingAuthor.valid) {
            return existingAuthor
        }

        try {
            const newAuthor = await Author.create(authorData)
            return { valid: true, message: 'Autor cadastrado com sucesso!', authorId: newAuthor._id }
        } catch (error) {
            return { valid: false, message: 'Erro ao cadastrar autor!', err: error }
        }
    }

    async getAllAuthors() {
        try {
            const authors = await Author.find({})
            return { valid: true, authors }
        } catch (error) {
            return { valid: false, message: 'Erro ao buscar autores', err: error }
        }
    }

    async getAuthorById(id) {
        try {
            const author = await Author.findById(id)
            if (!author) {
                return { valid: false, message: 'Autor não encontrado' }
            }
            return { valid: true, author }
        } catch (error) {
            return { valid: false, message: 'Erro ao buscar autor', err: error }
        }
    }

    async deleteAuthorById(id) {
        try {
            const author = await Author.findById(id)
            if (!author) {
                return { valid: false, message: 'Autor não encontrado' }
            }
            await Author.findByIdAndDelete(id)
            return { valid: true, message: 'Autor deletado com sucesso!' }
        } catch (error) {
            return { valid: false, message: 'Erro ao deletar autor', err: error }
        }
    }

    async updateAuthor(authorData) {
        const author = await this.getAuthorById(authorData.id)
        if (!author.valid) {
            return author
        }

        const existingAuthor = await this.existingAuthor(authorData)
        if (existingAuthor && !existingAuthor.valid) {
            return existingAuthor
        }

        try {
            const updatedAuthor = await Author.findByIdAndUpdate(
                authorData.id,
                { name: authorData.name },
                { new: true }
            )
            return { valid: true, message: 'Autor atualizado com sucesso!', authorId: updatedAuthor._id }
        } catch (error) {
            return { valid: false, message: 'Erro ao atualizar autor!', err: error }
        }
    }
}
