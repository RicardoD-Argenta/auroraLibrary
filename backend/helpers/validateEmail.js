const validator = require('validator')

const validateEmail = (email) => {

    if (!email || email.trim() === '') {
        return {valid: true}
    }

    if (!validator.isEmail(email)) {
        return {
            valid: false,
            message: 'Email inválido!'
        }
    }

    return {valid: true, email: email.toLowerCase().trim()}
}

module.exports = validateEmail