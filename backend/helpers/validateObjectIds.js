const { ObjectId } = require('mongoose').Types

const validateObjectIds = (config) => {
    return (req, res) => {
        const {
            objects = [],
            labels = {}
        } = config

        for (const field of objects) {
            const value = req.body[field]

            if (value === undefined || value === null || value === '') continue

            if (Array.isArray(value)) {
                const invalid = value.some(id => !ObjectId.isValid(id))
                if (invalid) {
                    res.status(400).json({ message: `${labels[field] || field} contém IDs inválidos` , err: 'invalid-array-of-ids' })
                    return false
                }
                continue
            }

            if (!ObjectId.isValid(value)) {
                res.status(400).json({ message: `${labels[field] || field} inválido` , err: 'invalid-id' })
                return false
            }
        }

        return true
    }
}

module.exports = validateObjectIds