const validator = require('validator')

const validateEmail = (email) => {

    if (!email || email.trim() === '') {
        return { valid: true }
    }

    if (!validator.isEmail(email)) {
        return {
            valid: false,
            status: 400,
            message: 'Email inválido',
            err: 'invalid-email'
        }
    }

    return { valid: true, email: email.toLowerCase().trim() }
}

module.exports = validateEmail