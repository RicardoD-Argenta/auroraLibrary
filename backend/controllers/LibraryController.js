// services
const LibraryService = require('../services/LibraryService')
const libraryService = new LibraryService()

// helpers
const emptyBody = require('../helpers/emptyBody') // verifica se o body está vazio
const emptyFields = require('../helpers/emptyFields') // verifica se os campos obrigatórios estão preenchidos
const validateID = require('../helpers/validateID') // verifica se o ID é válido
const validateBooleanFields = require('../helpers/validateBooleanFields') // verifica se campos booleanos sao válidos
const validateEmail = require('../helpers/validateEmail') // verifica se o email é válido
const validatePhone = require('../helpers/validatePhone') // verifica se o telefone é válido
const isDate = require('../helpers/isDate') // verifica se a data é válida

module.exports = class LibraryController {

    // ------------------------ criação de membros ------------------------ //
    static async registerMember(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { name, email, phone, student, member, observations } = req.body
        const studentData = student ?? {}
        const memberData = member ?? {}

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name', 'student.isStudent', 'member.isMember'],
            labels: {
                name: 'Nome',
                'student.isStudent': 'Estudante',
                'member.isMember': 'Membro'
            }
        }

        if (studentData.isStudent === 'true') {
            if (memberData.isMember === 'true') {
                return res.status(400).json({
                    message: 'Um usuário não pode ser estudante e membro ao mesmo tempo',
                    err: 'student-member-conflict'
                })
            }
            fieldsConfig.required.push('student.studentClass')
            fieldsConfig.labels['student.studentClass'] = 'Classe'
        } else {
            studentData.studentClass = null
        }

        if (memberData.isMember === 'true') {
            if (studentData.isStudent === 'true') {
                return res.status(400).json({
                    message: 'Um usuário não pode ser membro e estudante ao mesmo tempo',
                    err: 'member-student-conflict'
                })
            }
            fieldsConfig.required.push('member.memberSince')
            fieldsConfig.labels['member.memberSince'] = 'Data de entrada'
            fieldsConfig.atLeastOne = ['email', 'phone']
            fieldsConfig.labels.email = 'Email'
            fieldsConfig.labels.phone = 'Telefone'
        } else {
            memberData.memberSince = null
        }

        if (memberData.isMember === 'false' && studentData.isStudent === 'false') {
            return res.status(400).json({
                message: 'Um usuário deve ser membro ou estudante',
                err: 'member-student-conflict'
            })
        }

        const reqFields = emptyFields(fieldsConfig)
        const fieldsValidation = reqFields(req)
        if (!fieldsValidation.valid) {
            return res.status(fieldsValidation.status).json({
                message: fieldsValidation.message,
                err: fieldsValidation.err
            })
        }

        if (memberData.memberSince && memberData.memberSince.trim() !== '') {
            // verifica se a data é válida
            const dates = isDate({
                dates: ['member.memberSince'],
                labels: {
                    'member.memberSince': 'Data de entrada'
                }
            })
            const datesValidation = dates(req)
            if (!datesValidation.valid) {
                return res.status(datesValidation.status).json({
                    message: datesValidation.message,
                    err: datesValidation.err
                })
            }
        }

        const validBooleanFields = validateBooleanFields([
            {
                value: studentData.isStudent,
                field: 'student.isStudent',
                err: 'student-isStudent-not-valid'
            },
            {
                value: memberData.isMember,
                field: 'member.isMember',
                err: 'member-isMember-not-valid'
            }
        ])

        if (!validBooleanFields.valid) {
            return res.status(400).json({
                message: validBooleanFields.message,
                err: validBooleanFields.err
            })
        }

        let validMail = null
        if (email && email.trim() !== '') {
            // verifica se o email é valido
            validMail = validateEmail(email)
            if (!validMail.valid) {
                return res.status(validMail.status).json({
                    message: validMail.message,
                    err: validMail.err
                })
            }
        }

        let validPhone = null
        if (phone && phone.trim() !== '') {
            // verifica se o telefone é valido
            validPhone = validatePhone(phone)
            if (!validPhone.valid) {
                return res.status(validPhone.status).json({
                    message: validPhone.message,
                    err: validPhone.err
                })
            } 
        }
        
        const result = await libraryService.registerMember({
            name,
            email: validMail && validMail.email ? validMail.email : null,
            phone: validPhone && validPhone.phone ? validPhone.phone : null,
            student: studentData,
            member: memberData,
            observations
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                member: result.member
            })
        }

    }

    static async getAllMembers(req, res) {
        const result = await libraryService.getAllMembers()

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                members: result.members
            })
        }
    }


    static async getMember(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await libraryService.getMember({
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
                member: result.member
            })
        }
    }

    static async updateMember(req, res) {
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

        const { name, email, phone, student, member, observations } = req.body
        const studentData = student ?? {}
        const memberData = member ?? {}

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name', 'student.isStudent', 'member.isMember'],
            labels: {
                name: 'Nome',
                'student.isStudent': 'Estudante',
                'member.isMember': 'Membro'
            }
        }

        if (studentData.isStudent === 'true') {
            if (memberData.isMember === 'true') {
                return res.status(400).json({
                    message: 'Um usuário não pode ser estudante e membro ao mesmo tempo',
                    err: 'student-member-conflict'
                })
            }
            fieldsConfig.required.push('student.studentClass')
            fieldsConfig.labels['student.studentClass'] = 'Classe'
        } else {
            studentData.studentClass = null
        }

        if (memberData.isMember === 'true') {
            if (studentData.isStudent === 'true') {
                return res.status(400).json({
                    message: 'Um usuário não pode ser membro e estudante ao mesmo tempo',
                    err: 'member-student-conflict'
                })
            }
            fieldsConfig.required.push('member.memberSince')
            fieldsConfig.labels['member.memberSince'] = 'Data de entrada'
            fieldsConfig.atLeastOne = ['email', 'phone']
            fieldsConfig.labels.email = 'Email'
            fieldsConfig.labels.phone = 'Telefone'
        } else {
            memberData.memberSince = null
        }

        if (memberData.isMember === 'false' && studentData.isStudent === 'false') {
            return res.status(400).json({
                message: 'Um usuário deve ser membro ou estudante',
                err: 'member-student-conflict'
            })
        }

        const reqFields = emptyFields(fieldsConfig)
        const fieldsValidation = reqFields(req)
        if (!fieldsValidation.valid) {
            return res.status(fieldsValidation.status).json({
                message: fieldsValidation.message,
                err: fieldsValidation.err
            })
        }

        if (memberData.memberSince && memberData.memberSince.trim() !== '') {
            // verifica se a data é válida
            const dates = isDate({
                dates: ['member.memberSince'],
                labels: {
                    'member.memberSince': 'Data de entrada'
                }
            })
            const datesValidation = dates(req)
            if (!datesValidation.valid) {
                return res.status(datesValidation.status).json({
                    message: datesValidation.message,
                    err: datesValidation.err
                })
            }
        }

        // verifica se é estudante
        const validBooleanFields = validateBooleanFields([
            {
                value: studentData.isStudent,
                field: 'student.isStudent',
                err: 'student-isStudent-not-valid'
            },
            {
                value: memberData.isMember,
                field: 'member.isMember',
                err: 'member-isMember-not-valid'
            }
        ])

        if (!validBooleanFields.valid) {
            return res.status(400).json({
                message: validBooleanFields.message,
                err: validBooleanFields.err
            })
        }

        let validMail = null
        if (email && email.trim() !== '') {
            // verifica se o email é valido
            validMail = validateEmail(email)
            if (!validMail.valid) {
                return res.status(validMail.status).json({
                    message: validMail.message,
                    err: validMail.err
                })
            }
        }

        let validPhone = null
        if (phone && phone.trim() !== '') {
            // verifica se o telefone é valido
            validPhone = validatePhone(phone)
            if (!validPhone.valid) {
                return res.status(validPhone.status).json({
                    message: validPhone.message,
                    err: validPhone.err
                })
            } 
        }
        
        const result = await libraryService.updateMember({
            id,
            name,
            email: validMail && validMail.email ? validMail.email : null,
            phone: validPhone && validPhone.phone ? validPhone.phone : null,
            student: studentData,
            member: memberData,
            observations,
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                member: result.member
            })
        }
    }

    static async deleteMember(req, res) {
        const { id } = req.params

        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await libraryService.deleteMember({
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
                member: result.member
            })
        }
    }

    
    // ------------------------ criação de setores ------------------------ //
    static async registerSector(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { name, description } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name'],
            labels: {
                name: 'Nome',
                description: 'Descrição'
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

        const result = await libraryService.registerSector({
            name,
            description
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                sector: result.sector
            })
        }

    }

    static async getAllSectors(req, res) {
        const result = await libraryService.getAllSectors()

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                sectors: result.sectors
            })
        }
    }

    static async getSector(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await libraryService.getSector({
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
                sector: result.sector
            })
        }
    }

    static async updateSector(req, res) {
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

        const { name, description } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name'],
            labels: {
                name: 'Nome',
                description: 'Descrição'
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

        const result = await libraryService.updateSector({
            id,
            name,
            description
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                sector: result.sector
            })
        }
    }

    static async deleteSector(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await libraryService.deleteSector({
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
                sector: result.sector
            })
        }
    }


    // ------------------------ criação de setores ------------------------ //
    static async registerShelf(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { name, description } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name'],
            labels: {
                name: 'Nome',
                description: 'Descrição'
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

        const result = await libraryService.registerShelf({
            name,
            description
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                shelf: result.shelf
            })
        }
    }

    static async getAllShelves(req, res) {
        const result = await libraryService.getAllShelves()
        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                shelves: result.shelves
            })
        }
    }

    static async getShelf(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await libraryService.getShelf({
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
                shelf: result.shelf
            })
        }
    }

    static async updateShelf(req, res) {
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

        const { name, description } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name'],
            labels: {
                name: 'Nome',
                description: 'Descrição'
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

        const result = await libraryService.updateShelf({
            id,
            name,
            description
        })

        if (!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                shelf: result.shelf
            })
        }
    }

    static async deleteShelf(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const result = await libraryService.deleteShelf({
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
                shelf: result.shelf
            })
        }
    }

}