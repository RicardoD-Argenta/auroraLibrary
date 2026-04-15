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
        emptyBody(req, res)

        const { name, email, phone, student, member, observations } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name', 'student.isStudent', 'member.isMember'],
            labels: {
                name: 'Nome',
                'student.isStudent': 'Estudante',
                'member.isMember': 'Membro'
            }
        }

        if (student.isStudent === 'true') {
            if (member.isMember === 'true') {
                return res.status(400).json({
                    message: 'Um usuário não pode ser estudante e membro ao mesmo tempo',
                    err: 'student-member-conflict'
                })
            }
            fieldsConfig.required.push('student.studentClass')
            fieldsConfig.labels['student.studentClass'] = 'Classe'
        } else {
            student.studentClass = null
        }

        if (member.isMember === 'true') {
            if (student.isStudent === 'true') {
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
            member.memberSince = null
        }

        if (member.isMember === 'false' && student.isStudent === 'false') {
            return res.status(400).json({
                message: 'Um usuário deve ser membro ou estudante',
                err: 'member-student-conflict'
            })
        }

        const reqFields = emptyFields(fieldsConfig)
        const ok = reqFields(req, res)
        if (!ok) return

        if (member.memberSince && member.memberSince.trim() !== '') {
            // verifica se a data é válida
            const dates = isDate({
                dates: ['member.memberSince'],
                labels: {
                    'member.memberSince': 'Data de entrada'
                }
            })
            const okDates = dates(req, res)
            if (!okDates) return
        }

        const validBooleanFields = validateBooleanFields([
            {
                value: student.isStudent,
                field: 'student.isStudent',
                err: 'student-isStudent-not-valid'
            },
            {
                value: member.isMember,
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
                return res.status(400).json({
                    message: validMail.message
                })
            }
        }

        let validPhone = null
        if (phone && phone.trim() !== '') {
            // verifica se o telefone é valido
            validPhone = validatePhone(phone)
            if (!validPhone.valid) {
                return res.status(400).json({
                    message: validPhone.message
                })
            } 
        }
        
        const result = await libraryService.registerMember({
            name,
            email: validMail && validMail.email ? validMail.email : null,
            phone: validPhone && validPhone.phone ? validPhone.phone : null,
            student,
            member,
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

}