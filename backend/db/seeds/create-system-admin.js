const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


// models
const User = require('../../models/User/User')
const Library = require('../../models/Library/Library')
const LibraryParams = require('../../models/Library/LibraryParams')

// helpers
const createUserToken = require('../../helpers/createUserToken')

async function seed(){ 

    try {
        
        // verifica se já existe um administrador
        const existingAdmin = await User.findOne({ role: 'admin' })
        if (existingAdmin) {
            console.log('Administrador já existe, pulando seed...')
            return
        }

        // cria uma biblioteca
        const library = new Library({
            name: 'Library',
        })

        await library.save()

        // criação do libraryParams
        const libraryParams = new LibraryParams({
            libraryId: library._id,
        })
        await libraryParams.save()

        console.log('Biblioteca criada com sucesso')


        // cria um usuário 
        const user = new User({
            name: 'Admin',
            login: 'admin',
            password: 'inovatechadmin',
            role: 'admin'
        })

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(user.password, salt)
        user.password = passwordHash

        const newUser = await user.save()
        const token = await createUserToken(newUser)
        console.log('Usuário criado com sucesso', { userId: newUser._id })

        console.log('Usuário cadastrado com sucesso \n')
        
        console.log('🎉 SEED DE ADMINISTRADOR CRIADO COM SUCESSO! 🎉')
        console.log('🔑 Token gerado:', token)
        console.log('\n🎉 SETUP COMPLETO!')
        console.log('📧 Login: admin')
        console.log('🔑 Senha: inovatechadmin')
        console.log('⚠️  LEMBRE-SE DE MUDAR A SENHA NO PRIMEIRO LOGIN!\n')
    } catch (error) {
        console.error('❌ Erro ao criar administrador:', error)
        throw error
    }

}


if (require.main === module) {
    require('dotenv').config()
    mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI)
        .then(() => {
            console.log('📦 Conectado ao MongoDB')
            return seed()
        })
        .then(() => {
            console.log('✅ Seed finalizado')
            process.exit(0)
        })
        .catch((err) => {
            console.error('💥 Erro fatal:', err)
            process.exit(1)
        })
}

module.exports = seed