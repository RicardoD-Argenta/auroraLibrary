// imports
const bcrypt = require('bcrypt')

// models
const User = require('../models/User/User')

// helpers
const createUserToken = require('../helpers/createUserToken')

module.exports = class UserService {

    async registeredUser(userData) {
        try {
            const user = await User.findOne({ 
                $or: [
                    { login: userData.login },
                ], _id: { $ne: userData.id }
            })
            if (user) {
                return {
                    valid: false,
                    message: 'Usuário já cadastrado',
                    err: 'user-already-registered'
                }
            }
        }
        catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar usuário',
                err: error.message
            }
        }
    }

    async existingUser(userData) {
        try {
            const user = await User.findById({ _id: userData.id }, '-password')
            if (!user) {
                return {
                    valid: false,
                    message: 'Usuário não cadastrado',
                    err: 'user-not-registered'
                }
            }
            if (userData.userRole === 'librarian' && user.id !== userData.userId) {
                return {
                    valid: false,
                    message: 'Acesso negado',
                    err: 'access-denied'
                }
            } else {
                return {
                    valid: true,
                    user
                }
            }
        } catch (error) {
            console.log(error)
            return {
                valid: false,
                message: 'Erro ao verificar usuário',
                err: error.message
            }
        }
        
    }

    async register(userData) {
        // verifica se o usuário já está cadastrado
        const existingUser = await this.registeredUser(userData)
        if (existingUser && !existingUser.valid) {
            return existingUser
        }

        // criação de senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(userData.password, salt)

        const user = new User({
            name: userData.name,
            login: userData.login,
            password: passwordHash,
            role: userData.role
        })

        try {
            const newUser = await user.save()
            const token = createUserToken(newUser)
            return { 
                valid: true,
                message: 'Cadastro realizado com sucesso',
                token: token,
                userId: newUser._id,
                userRole: newUser.role
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao cadastrar usuário',
                err: error.message
            }
        }
    }


    async login(userData) {
        // verifica se o usuário já está cadastrado
        const user = await User.findOne({ login: userData.login })
        if (!user) {
            return {
                valid: false, 
                message: 'Login inválido! Verifique o login e senha.',
                err: 'login-not-valid'
            }
        }

        // verifica se a senha está correta
        const checkPassword = await bcrypt.compare(userData.password, user.password)
        if (!checkPassword) {
            return { 
                valid: false, 
                message: 'Login inválido! Verifique o login e senha.',
                err: 'login-not-valid'
            }
        }

        try {
            const token = await createUserToken(user)
            return { 
                valid: true,
                message: 'Login realizado com sucesso',
                token: token,
                userId: user._id,
                userRole: user.role
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao realizar login',
                err: error.message
            }
        }
    }

    async getAllUsers() {
        try {
            const users = await User.find({}, '-password')
            return {
                valid: true,
                users
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao buscar usuários',
                err: error.message
             }
         }
    }

    async getUser(userData) {
        const existingUser = await this.existingUser(userData)
        if (existingUser && !existingUser.valid) {
            return existingUser
        } else {
            return {
                valid: true,
                user: existingUser.user
            }
        }
    }

    async updateUser(userData) {
        const existingUser = await this.existingUser(userData)
        if (existingUser && !existingUser.valid) {
            return existingUser
        }

        const user = await User.findById(userData.id)

        const registeredUser = await this.registeredUser(userData)
        if (registeredUser && !registeredUser.valid) {
            return registeredUser
        }

        // verifica se a senha é igual a confirmação
        let newPassword = user.password
        if (userData.password  && userData.password.trim() !== '' && userData.oldPassword && userData.oldPassword.trim() !== '') {
            const isPasswordValid = await bcrypt.compare(userData.oldPassword, user.password)
            if (!isPasswordValid) {
                return { valid: false, message: 'Senha atual incorreta' }
            }
            const salt = await bcrypt.genSalt(12)
            newPassword = await bcrypt.hash(userData.password, salt)
        }

        user.set({
            name: userData.name,
            login: userData.login,
            password: newPassword,
        })

        try {
            const updatedUser = await user.save()
            const token = await createUserToken(updatedUser)
            return {
                valid: true,
                message: 'Usuário atualizado com sucesso',
                token: token,
                userId: updatedUser._id,
                userRole: updatedUser.role
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao atualizar usuário',
                err: error.message
             }
        }

    }

    async deleteUser(userData) {
        const existingUser = await this.existingUser(userData)
        if (existingUser && !existingUser.valid) {
            return existingUser
        }

        if (existingUser.user.role === 'admin') {
            return {
                valid: false,
                message: 'Acesso negado',
                err: 'access-denied'
            }
        }

        try {
            await User.findByIdAndDelete(userData.id)
            return {
                valid: true,
                message: 'Usuário deletado com sucesso'
             }
        } catch (error) {
            return {
                valid: false,
                message: 'Erro ao deletar usuário',
                err: error.message
            }
        }

    }

}