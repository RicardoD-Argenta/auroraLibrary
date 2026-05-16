require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path');

const app = express()

// Configuração do JSON
app.use(express.json())

// Sanitização global de strings no body
const trimBody = require('./helpers/trimBody')
app.use(trimBody)

// Configuração do CORS
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))

// Pasta pra imagens
app.use('/images', express.static(path.join(__dirname, 'public/images')))

// configuração dos crons
// require('./helpers/cronTabs/verifyOverdueCron')


// Rotas
const connectDB = require('./db/conn')
const AuthRoutes = require('./routes/AuthRoutes')
const LibraryRoutes = require('./routes/LibraryRoutes')
const BookRoutes = require('./routes/BookRoutes')
const LoanRoutes = require('./routes/LoanRoutes')

app.use('/auth', AuthRoutes)
app.use('/library', LibraryRoutes)
app.use('/book', BookRoutes)
app.use('/loan', LoanRoutes)

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