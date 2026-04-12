const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

const User = require('../models/User/User')

// Middleware para verificar o token JWT
const checkToken = (config = {}) => {
    return async (req, res, next) => {
        const {
            role = []
        } = config

        // validações gerais
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Acesso negado! Token não fornecido.' })
        }

        const token = getToken(req)

        if (!token) {
            return res.status(401).json({ message: 'Acesso negado! Token não fornecido.' })
        }

        try {
            // verifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded

            const userRole = await User.findOne({ _id: decoded.id })

            if (!userRole) {
                return res.status(401).json({ message: 'Acesso negado! Usuário não cadastrado.' })
            }
            
            // valida se o role do usuário está dentro dos roles permitidos
            const rolesArray = Array.isArray(role) ? role : [role]
            if (rolesArray.length > 0 && !rolesArray.includes(userRole.role)) {
                return res.status(403).json({ message: 'Acesso negado! Permissão insuficiente.' })
            }

            // adiciona o role do usuário autenticado ao req
            req.authenticatedUserId = decoded.id
            req.authenticatedUserRole = userRole.role
            req.authenticatedUserLibraryId = userRole.libraryId
            
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Acesso negado! Token expirado.' })
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Acesso negado! Token inválido.' })
            }
            return res.status(500).json({ message: 'Erro ao verificar token', err: error })
        }
    }
    

}

module.exports = checkToken