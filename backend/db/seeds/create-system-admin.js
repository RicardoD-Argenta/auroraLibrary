const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


// models
const User = require('../../models/User/User')
const School = require('../../models/School/School')
const UserSchool = require('../../models/User/UserSchool')
const Country = require('../../models/School/Country')
const State = require('../../models/School/State')
const City = require('../../models/School/City')
const SchoolLicense = require('../../models/School/SchoolLicense')
const SchoolParams = require('../../models/School/SchoolParams')

// helpers
const createUserToken = require('../../helpers/createUserToken')

async function seed(){ 

    try {
        
         // verifica se já existe um arquiteto
        const existingAdmin = await UserSchool.findOne({ role: 'architect' })
        if (existingAdmin) {
            console.log('Arquiteto já existe, pulando seed...')
            return
        }

        // cria pais
        const country = new Country({
            name: 'PAIS',
            abbreviation: '000'
        })

        await country.save()
        console.log('Pais criado com sucesso')

        // cria estado
        const state = new State({
            name: 'ESTADO',
            abbreviation: '000',
            countryId: country._id
        })

        await state.save()
        console.log('Estado criado com sucesso')


        // cria cidade
        const city = new City({
            name: 'CIDADE',
            stateId: state._id
        })

        await city.save()
        console.log('Cidade criada com sucesso')


        // cria licença da escola
        const schoolLicense = new SchoolLicense({
            startDate: new Date('2000-01-01'),
            finishDate: new Date('2099-12-31')
        })

        await schoolLicense.save()
        console.log('Licença da escola criada com sucesso')

        // cria uma escola base
        const school = new School({
            name: 'Inovatech',
            code: '00000000',
            address: 'Rua da desordem, 00',
            cityId: city._id,
            email: 'admin@inovatech.com.br',
            phone: '1122334455',
            taxId: '11111111111',
            SchoolLicenseId: schoolLicense._id,
            isActive: true
        })

        await school.save()

        // criação do schoolParams
        const schoolParams = new SchoolParams({
            schoolId: school._id,
        })
        await schoolParams.save()

        console.log('Escola criada com sucesso')


        // cria um usuário 
        const user = new User({
            name: 'Arquiteto',
            email: 'arquiteto@inovatech.com.br',
            phone: '1122334455',
            password: '123456789'
        })

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(user.password, salt)
        user.password = passwordHash

        const newUser = await user.save()
        const token = await createUserToken(newUser)
        console.log('Usuário criado com sucesso', { userId: newUser._id })

        // cria role

        const userSchool = new UserSchool({
            userId: user._id,
            schoolId: school._id,
            role: 'architect'
        })

        await userSchool.save()
        console.log('Usuário cadastrado com sucesso')
        
        
        console.log('🔑 Token gerado:', token)

        console.log('\n🎉 SETUP COMPLETO!')
        console.log('📧 Email: arquiteto@inovatech.com.br')
        console.log('🔑 Senha: 123456789')
        console.log('⚠️  LEMBRE-SE DE MUDAR A SENHA NO PRIMEIRO LOGIN!\n')
    } catch (error) {
        console.error('❌ Erro ao criar arquiteto:', error)
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