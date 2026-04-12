require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path');

const app = express()

// Configuração do JSON
app.use(express.json())

// Configuração do CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// Pasta pra imagens
app.use('/images', express.static(path.join(__dirname, 'public/images')))

// configuração dos crons
// require('./helpers/cronTabs/verifyOverdueCron')


// Rotas
const connectDB = require('./db/conn')
const AuthRoutes = require('./routes/AuthRoutes')


app.use('/auth', AuthRoutes)


// Inicialização
const start = async () => {
    try {
        await connectDB
        app.listen(5000, () => console.log('Rodando na porta 5000'))
    } catch (error) {
        console.log('Erro ao iniciar servidor:', error)
        process.exit(1)
    }
}

start()