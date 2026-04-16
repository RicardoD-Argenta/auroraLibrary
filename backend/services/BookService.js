const Genre = require('../models/Book/Genre')

module.exports = class BookService {

    // ------------------------ GÊNEROS ------------------------ //

    async existingGenre(genreData) {
        const query = { name: { $regex: new RegExp(`^${genreData.name}$`, 'i') } }
        if (genreData.id) {
            query._id = { $ne: genreData.id }
        }
        const existingGenre = await Genre.findOne(query)
        if (existingGenre) {
            return { valid: false, message: 'Gênero já cadastrado' }
        }
        return { valid: true }
    }

    async createGenre(genreData) {
        const existingGenre = await this.existingGenre(genreData)
        if (existingGenre && !existingGenre.valid) {
            return existingGenre
        }

        const genre = new Genre({
            name: genreData.name
        })

        try {
            const newGenre = await genre.save()
            return { valid: true, message: 'Gênero cadastrado com sucesso!', genreId: newGenre._id }
        } catch (error) {
            return { valid: false, message: 'Erro ao cadastrar gênero!', err: error }
        }
    }

    async getAllGenres() {
        try {
            const genres = await Genre.find({})
            return { valid: true, genres }
        } catch (error) {
            return { valid: false, message: 'Erro ao buscar gêneros', err: error }
        }
    }

    async getGenreById(id) {
        try {
            const genre = await Genre.findById(id)
            if (!genre) {
                return { valid: false, message: 'Gênero não encontrado' }
            }
            return { valid: true, genre }
        } catch (error) {
            return { valid: false, message: 'Erro ao buscar gênero', err: error }
        }
    }

    async deleteGenreById(id) {
        try {
            const genre = await Genre.findById(id)
            if (!genre) {
                return { valid: false, message: 'Gênero não encontrado' }
            }

            await Genre.findByIdAndDelete(id)
            return { valid: true, message: 'Gênero deletado com sucesso!' }
        } catch (error) {
            return { valid: false, message: 'Erro ao deletar gênero', err: error }
        }
    }

    async updateGenre(genreData) {
        const genre = await this.getGenreById(genreData.id)
        if (!genre.valid) {
            return genre
        }

        try {
            const updatedGenre = await Genre.findByIdAndUpdate(
                genreData.id,
                { name: genreData.name },
                { new: true }
            )
            return { valid: true, message: 'Gênero atualizado com sucesso!', genreId: updatedGenre._id }
        } catch (error) {
            return { valid: false, message: 'Erro ao atualizar gênero!', err: error }
        }
    }
}
