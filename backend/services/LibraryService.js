// imports

// models
const Member = require('../models/Library/Member')
const Sector = require('../models/Library/Sector')
const Shelf = require('../models/Library/Shelf')
const Library = require('../models/Library/Library')
const LibraryParams = require('../models/Library/LibraryParams')

// helpers


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

        const member = new Member({
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

    async getAllMembers() {
        try {
            const members = await Member.find()
            return {
                valid: true,
                members
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

        const member = existingMember.member
        member.set({
            name: memberData.name,
            email: memberData.email,
            phone: memberData.phone,
            student: memberData.student,
            member: memberData.member,
            observations: memberData.observations
        })

        const registeredMember = await this.registeredMember(memberData)
        if (registeredMember && !registeredMember.valid) {
            return registeredMember
        }

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

        try {
            const sector = new Sector({
                name: sectorData.name,
                description: sectorData.description
            })
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

    async getAllSectors() {
        try {
            const sectors = await Sector.find()
            return {
                valid: true,
                sectors
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


    // ------------------------ criação de setores ------------------------ //
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
                    message: 'Estante já cadastrada',
                    err: 'shelf-already-registered'
                }
            }
        }
        catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar estante',
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
                    message: 'Estante não cadastrada',
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
                message: 'Erro ao verificar estante',
                err: error.message
            }
        }
    }

    async registerShelf(shelfData) {
        const registeredShelf = await this.registeredShelf(shelfData)
        if (registeredShelf && !registeredShelf.valid) {
            return registeredShelf
        }

        try {
            const shelf = new Shelf({
                name: shelfData.name,
                description: shelfData.description
            })
            const newShelf = await shelf.save()
            return {
                valid: true,
                message: 'Estante cadastrada com sucesso',
                shelf: newShelf
            }
        }
        catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar estante',
                err: error.message
            }
        }
    }

    async getAllShelves() {
        try {
            const shelves = await Shelf.find()
            return {
                valid: true,
                shelves
            }
        }
        catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar estantes',
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
                message: 'Estante atualizado com sucesso',
                shelf: updatedShelf
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar estante',
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
                message: 'Estante deletado com sucesso'
             }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao deletar estante',
                err: error.message
            }
        }
    }

    // ------------------------ Leitura e Edição de Bibliotecas ------------------------ //
    async getLibrary() {
        try {
            const library = await Library.findOne()
            return {
                valid: true,
                library
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