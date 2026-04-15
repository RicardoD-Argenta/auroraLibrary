const validBooleanValues = ['true', 'false', true, false]

const validateBooleanFields = (fields) => {
    const invalidField = fields.find(({ value }) => !validBooleanValues.includes(value))

    if (invalidField) {
        return {
            valid: false,
            message: `O campo deve ser um booleano (true ou false)`,
            err: invalidField.err
        }
    }

    return { valid: true }
}

module.exports = validateBooleanFields