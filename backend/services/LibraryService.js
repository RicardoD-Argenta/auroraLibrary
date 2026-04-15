// imports

// models
const Member = require('../models/Library/Member')

// helpers


module.exports = class LibraryService {

    async registeredMember(memberData) {
        try {
            const member = await Member.findOne({ 
                $or: [
                    { email: memberData.email },
                    { phone: memberData.phone }
                ], _id: { $ne: memberData.id }
            })
            if (member) {
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

}