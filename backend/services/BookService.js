// models
    const Publisher = require('../models/Book/Publisher')

// helpers


module.exports = class BookService {

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
}