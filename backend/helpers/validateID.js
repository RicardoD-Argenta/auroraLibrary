const { ObjectId } = require('mongodb')

const validateID = (id, res) => {
    if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'ID inválido' })
            return
    }
}

module.exports = validateID