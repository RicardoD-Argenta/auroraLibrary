// imports

// models
const Member = require('../models/Library/Member')
const Sector = require('../models/Library/Sector')

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

}