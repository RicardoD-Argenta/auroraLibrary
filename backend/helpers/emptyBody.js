const emptyBody = (req, res, next) => {
    if (!req.body) {
        res.status(400).json({ message: 'Corpo da requisição não pode ser vazio!' })
        return
    }    
}

module.exports = emptyBody