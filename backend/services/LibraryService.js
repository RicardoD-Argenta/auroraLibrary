// models
    const Member = require('../models/Library/Member')
    const Sector = require('../models/Library/Sector')
    const Shelf = require('../models/Library/Shelf')
    const Library = require('../models/Library/Library')
    const LibraryParams = require('../models/Library/LibraryParams')

// helpers
    const Counter = require('../models/Counter')


module.exports = class LibraryService {

    async registeredMember(memberData) {
        try {

            const conditions = []
            if (memberData.email && memberData.email.trim() !== '') {
                conditions.push({ email: memberData.email })
            }
            if (memberData.phone && memberData.phone.trim() !== '') {
                conditions.push({ phone: memberData.phone })
            }


            let existingMember = null
            if (conditions.length > 0) {
                existingMember = await Member.findOne({ $or: conditions, _id: { $ne: memberData.id } })
            }

            if (existingMember) {
                return {
                    valid: false,
                    message: 'Membro já cadastrado',
                    err: 'member-already-registered'
                }
            }
        } catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar membro',
                err: error.message
            }
        }
    }

    async existingMember(memberData) {
        try {
            const member = await Member.findById(memberData.id)
            if (!member) {
                return {
                    valid: false,
                    message: 'Membro não cadastrado',
                    err: 'member-not-registered'
                }
            }
            return {
                valid: true,
                member
            }
        } catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar membro',
                err: error.message
            }
        }
    }

    async registerMember(memberData) {
        
        // verifica se o membro já está cadastrado
        const existingMember = await this.registeredMember(memberData)
        if (existingMember && !existingMember.valid) {
            return existingMember
        }

        const code = await Counter.nextSequence('member')

        const member = new Member({
            code,
            name: memberData.name,
            email: memberData.email,
            phone: memberData.phone,
            student: memberData.student,
            member: memberData.member,
            observations: memberData.observations
        })
        
        try {
            const newMember = await member.save()
            return {
                valid: true,
                message: 'Membro cadastrado com sucesso',
                member: newMember
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar membro',
                err: error.message
            }
        }
    }

    async getAllMembers({ page = 1, search = '' } = {}) {
        try {
            const limit = 12
            const skip = (page - 1) * limit

            const query = search
                ? { $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { code: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                    { observations: { $regex: search, $options: 'i' } }
                ] }
                : {}

            const members = await Member.find(query).skip(skip).limit(limit)
            const total = await Member.countDocuments(query)
            
            return {
                valid: true,
                members,
                total,
                pages: Math.ceil(total / limit)
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar membros',
                err: error.message
             }
         }
    }

    async getMember(memberData) {
        // verifica se o membro já está cadastrado
        const existingMember = await this.existingMember(memberData)
        if (existingMember && !existingMember.valid) {
            return existingMember
        }

        return {
            valid: true,
            member: existingMember.member
        }
    }

    async updateMember(memberData) {
        const existingMember = await this.existingMember(memberData)
        if (existingMember && !existingMember.valid) {
            return existingMember
        }

        const registeredMember = await this.registeredMember(memberData)
        if (registeredMember && !registeredMember.valid) {
            return registeredMember
        }

        const member = existingMember.member
        member.set({
            name: memberData.name,
            email: memberData.email,
            phone: memberData.phone,
            student: memberData.student,
            member: memberData.member,
            observations: memberData.observations
        })

        try {
            const updatedMember = await member.save()
            return {
                valid: true,
                message: 'Membro atualizado com sucesso',
                member: updatedMember
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar membro',
                err: error.message
             }
        }
    }

    async deleteMember(memberData) {
        const existingMember = await this.existingMember(memberData)
        if (existingMember && !existingMember.valid) {
            return existingMember
        }

        try {
            await Member.findByIdAndDelete(memberData.id)
            return {
                valid: true,
                message: 'Membro deletado com sucesso'
             }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao deletar membro',
                err: error.message
            }
        }
    }


    // ------------------------ criação de setores ------------------------ //
    async registeredSector(sectorData) {
        try {
            const sector = await Sector.findOne({
                $or: [
                    { name: sectorData.name },
                ], _id: { $ne: sectorData.id }
            })
            if (sector) {
                return {
                    valid: false,
                    message: 'Setor já cadastrado',
                    err: 'sector-already-registered'
                }
            }
        }
        catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar setor',
                err: error.message
            }
        }
    }

    async existingSector(sectorData) {
        try {
            const sector = await Sector.findById(sectorData.id)
            if (!sector) {
                return {
                    valid: false,
                    message: 'Setor não cadastrado',
                    err: 'sector-not-registered'
                }
            }
            return {
                valid: true,
                sector
            }
        } catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar setor',
                err: error.message
            }
        }
    }

    async registerSector(sectorData) {
        // verifica se o setor já está cadastrado
        const registeredSector = await this.registeredSector(sectorData)
        if (registeredSector && !registeredSector.valid) {
            return registeredSector
        }

        const code = await Counter.nextSequence('sector')

        const sector = new Sector({
            code,
            name: sectorData.name,
            description: sectorData.description
        })
        try {
            const newSector = await sector.save()
            return {
                valid: true,
                message: 'Setor cadastrado com sucesso',
                sector: newSector
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar setor',
                err: error.message
            }
        }
    }

    async getAllSectors({ page = 1, search = '' } = {}) {
        try {
            const limit = 12
            const skip = (page - 1) * limit

            const query = search
                ? { $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { code: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ] }
                : {}

            const sectors = await Sector.find(query).skip(skip).limit(limit)
            const total = await Sector.countDocuments(query)

            return {
                valid: true,
                sectors,
                total,
                pages: Math.ceil(total / limit)
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar setores',
                err: error.message
             }
        }
    }

    async getSector(sectorData) {
        const existingSector = await this.existingSector(sectorData)
        if (existingSector && !existingSector.valid) {
            return existingSector
        }
        return {
            valid: true,
            sector: existingSector.sector
        }
    }

    async updateSector(sectorData) {
        const existingSector = await this.existingSector(sectorData)
        if (existingSector && !existingSector.valid) {
            return existingSector
        }

        const sector = existingSector.sector
        sector.set({
            name: sectorData.name,
            description: sectorData.description
        })

        const registeredSector = await this.registeredSector(sectorData)
        if (registeredSector && !registeredSector.valid) {
            return registeredSector
        }

        try {
            const updatedSector = await sector.save()
            return {
                valid: true,
                message: 'Setor atualizado com sucesso',
                sector: updatedSector
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar setor',
                err: error.message
             }
        }
    }

    async deleteSector(sectorData) {
        const existingSector = await this.existingSector(sectorData)
        if (existingSector && !existingSector.valid) {
            return existingSector
        }

        try {
            await Sector.findByIdAndDelete(sectorData.id)
            return {
                valid: true,
                message: 'Setor deletado com sucesso'
             }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao deletar setor',
                err: error.message
            }
        }
    }


    // ------------------------ criação de prateleiras ------------------------ //
    async registeredShelf(shelfData) {
        try {
            const shelf = await Shelf.findOne({
                $or: [
                    { name: shelfData.name },
                ], _id: { $ne: shelfData.id }
            })
            if (shelf) {
                return {
                    valid: false,
                    message: 'Prateleira já cadastrada',
                    err: 'shelf-already-registered'
                }
            }
        }
        catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar prateleira',
                err: error.message
            }
        }
    }

    async existingShelf(shelfData) {
        try {
            const shelf = await Shelf.findById(shelfData.id)
            if (!shelf) {
                return {
                    valid: false,
                    message: 'Prateleira não cadastrada',
                    err: 'shelf-not-registered'
                }
            }
            return {
                valid: true,
                shelf
            }
        } catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar prateleira',
                err: error.message
            }
        }
    }

    async registerShelf(shelfData) {
        const registeredShelf = await this.registeredShelf(shelfData)
        if (registeredShelf && !registeredShelf.valid) {
            return registeredShelf
        }

        const code = await Counter.nextSequence('shelf')

        const shelf = new Shelf({
            code,
            name: shelfData.name,
            description: shelfData.description
        })
        try {
            const newShelf = await shelf.save()
            return {
                valid: true,
                message: 'Prateleira cadastrada com sucesso',
                shelf: newShelf
            }
        }
        catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar prateleira',
                err: error.message
            }
        }
    }

    async getAllShelves({ page = 1, search = '' } = {}) {
        try {
            const limit = 12
            const skip = (page - 1) * limit

            const query = search
                ? { $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { code: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ] }
                : {}

            const shelves = await Shelf.find(query).skip(skip).limit(limit)
            const total = await Shelf.countDocuments(query)

            return {
                valid: true,
                shelves,
                total,
                pages: Math.ceil(total / limit)
            }
        }
        catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar prateleiras',
                err: error.message
             }
        }
    }

    async getShelf(shelfData) {
        const existingShelf = await this.existingShelf(shelfData)
        if (existingShelf && !existingShelf.valid) {
            return existingShelf
        }
        return {
            valid: true,
            shelf: existingShelf.shelf
        }
    }

    async updateShelf(shelfData) {
        const existingShelf = await this.existingShelf(shelfData)
        if (existingShelf && !existingShelf.valid) {
            return existingShelf
        }

        const shelf = existingShelf.shelf
        shelf.set({
            name: shelfData.name,
            description: shelfData.description
        })

        const registeredShelf = await this.registeredShelf(shelfData)
        if (registeredShelf && !registeredShelf.valid) {
            return registeredShelf
        }

        try {
            const updatedShelf = await shelf.save()
            return {
                valid: true,
                message: 'Prateleira atualizada com sucesso',
                shelf: updatedShelf
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar prateleira',
                err: error.message
             }
        }
    }

    async deleteShelf(shelfData) {
        const existingShelf = await this.existingShelf(shelfData)
        if (existingShelf && !existingShelf.valid) {
            return existingShelf
        }

        try {
            await Shelf.findByIdAndDelete(shelfData.id)
            return {
                valid: true,
                message: 'Prateleira deletada com sucesso'
             }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao deletar prateleira',
                err: error.message
            }
        }
    }

    // ------------------------ Leitura e Edição de Bibliotecas ------------------------ //
    async getLibrary() {
        try {
            const library = await Library.findOne()
            const libraryParams = await LibraryParams.findOne()
            return {
                valid: true,
                library,
                libraryParams
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar biblioteca',
                err: error.message
             }
        }
    }

    async updateLibrary(libraryData) {
        const library = await Library.findOne()
        const libraryParams = await LibraryParams.findOne()
        library.set({
            name: libraryData.name,
        })
        libraryParams.set({
            params: libraryData.params
        })

        try {
            const updatedLibrary = await library.save()
            const updatedLibraryParams = await libraryParams.save()
            return {
                valid: true,
                message: 'Biblioteca atualizada com sucesso',
                library: updatedLibrary,
                libraryParams: updatedLibraryParams
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar biblioteca',
                err: error.message
             }
        }
    }

}