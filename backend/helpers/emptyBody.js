const emptyBody = (req) => {
    if (!req.body) {
        return {
            valid: false,
            status: 400,
            message: 'Corpo da requisição não pode ser vazio',
            err: 'empty-body'
        }
    }

    return { valid: true }
}

module.exports = emptyBody