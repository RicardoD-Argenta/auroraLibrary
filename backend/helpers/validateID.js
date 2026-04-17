const { ObjectId } = require('mongodb')

const validateID = (id) => {
    if (!ObjectId.isValid(id)) {
            return {
                valid: false,
                status: 400,
                message: 'ID inválido',
                err: 'invalid-id'
            }
    }

    return { valid: true }
}

module.exports = validateID