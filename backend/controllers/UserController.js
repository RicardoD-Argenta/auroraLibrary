
// services
const UserService = require('../services/UserService')
const userService = new UserService()

// helpers
const emptyBody = require('../helpers/emptyBody') // verifica se o body está vazio
const emptyFields = require('../helpers/emptyFields') // verifica se os campos obrigatórios estão preenchidos
const validateID = require('../helpers/validateID') // verifica se o ID é válido

module.exports = class UserController {

    // ------------------------ criação de usuário ------------------------ //
    static async register(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { name, login, password, confirmPassword, role } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['name', 'login', 'password', 'confirmPassword', 'role'],
            labels: {
                name: 'Nome',
                login: 'Login',
                password: 'Senha',
                confirmPassword: 'Contra-senha',
                role: 'Cargo',
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

        // verifica se o cargo é válido
        if (!['admin', 'librarian'].includes(role)) {
            return res.status(400).json({
                message: 'Cargo inválido'
            })
        }

        const passwordsAreValid = [password, confirmPassword].every(
            (value) => value.length >= 6 && value.length <= 255
        )

        if (!passwordsAreValid) {
            return res.status(400).json({
                message: 'Senha e contra-senha devem ter entre 6 e 255 caracteres',
                err: 'password-not-valid'
            })
        }

        const result = await userService.register({
            name,
            login,
            password,
            confirmPassword,
            role
        })
        
        if(!result.valid) {
             return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                token: result.token,
                userId: result.userId,
                userRole: result.userRole
            })
        }

    }

    static async login(req, res) {
        const bodyValidation = emptyBody(req)
        if (!bodyValidation.valid) {
            return res.status(bodyValidation.status).json({
                message: bodyValidation.message,
                err: bodyValidation.err
            })
        }

        const { login, password } = req.body

        // verifica os campos obrigatórios
        const fieldsConfig = {
            required: ['login', 'password'],
            labels: {
                login: 'Login',
                password: 'Senha'
            }
        }
        
        let reqFields = emptyFields(fieldsConfig)
        let fieldsValidation = reqFields(req)
        if (!fieldsValidation.valid) {
            return res.status(fieldsValidation.status).json({
                message: fieldsValidation.message,
                err: fieldsValidation.err
            })
        }

        const result = await userService.login({
            login, 
            password 
        })

        if(!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                token: result.token,
                userId: result.userId,
                userRole: result.userRole
            })
        }
    }

    static async getAllUsers(req, res) {
        const result = await userService.getAllUsers()
        if(!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                users: result.users
            })
        }
    }

    static async getUser(req, res) {
        const { id } = req.params
        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const userId = req.authenticatedUserId
        const userRole = req.authenticatedUserRole

        const result = await userService.getUser({
            id,
            userRole,
            userId
        })
        if(!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                user: result.user
            })
        }
    }

    static async updateUser(req, res) {
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

        const userId = req.authenticatedUserId
        const userRole = req.authenticatedUserRole

        const { name, login, password, oldPassword } = req.body

        const fieldsConfig = {
            required: ['name', 'login'],
            labels: {
                name: 'Nome',
                login: 'Login'
            }
        }

        if (password && password.trim() !== '' || oldPassword && oldPassword.trim() !== '') {
            fieldsConfig.required.push('password', 'oldPassword')
            fieldsConfig.labels.password = 'Nova senha'
            fieldsConfig.labels.oldPassword = 'Senha atual'

            // verifica se a senha existe e tem entre 6 e 255 caracteres
            const passwordsAreValid = [password, oldPassword].every(
                (value) => value.length >= 6 && value.length <= 255
            )

            if (!passwordsAreValid) {
                return res.status(400).json({
                    message: 'Senha e contra-senha devem ter entre 6 e 255 caracteres',
                    err: 'password-not-valid'
                })
            }

        }
        
        let reqFields = emptyFields(fieldsConfig)
        let fieldsValidation = reqFields(req)
        if (!fieldsValidation.valid) {
            return res.status(fieldsValidation.status).json({
                message: fieldsValidation.message,
                err: fieldsValidation.err
            })
        }

        

        const result = await userService.updateUser({
            id,
            name,
            login,
            password,
            oldPassword,
            userId,
            userRole
        })
        if(!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                user: result.user
            })
        }
    }

    static async deleteUser(req, res) {
        const { id } = req.params

        const idValidation = validateID(id)
        if (!idValidation.valid) {
            return res.status(idValidation.status).json({
                message: idValidation.message,
                err: idValidation.err
            })
        }

        const userId = req.authenticatedUserId
        const userRole = req.authenticatedUserRole

        const result = await userService.deleteUser({
            id,
            userId,
            userRole
        })
        if(!result.valid) {
            return res.status(400).json({
                message: result.message,
                err: result.err
            })
        } else {
            return res.status(200).json({
                message: result.message,
                user: result.user
            })
        }
    }

}