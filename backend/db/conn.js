const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/app_lib") // Não vou proteger pois é um programa de código aberto
    } catch (error) {
        console.log("Falha ao iniciar o banco", error)
        throw error
    }
}

module.exports = connectDB()