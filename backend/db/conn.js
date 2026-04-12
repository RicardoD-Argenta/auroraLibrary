const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL) // Não vou proteger pois é um programa de código aberto
    } catch (error) {
        console.log("Falha ao iniciar o banco", error)
        throw error
    }
}

module.exports = connectDB()