const jwt = require('jsonwebtoken')

const createUserToken = (user) => {
    // criar um token
    const token = jwt.sign({
        name: user.name,
        id: user._id,
    }, process.env.JWT_SECRET )

    return token
}

module.exports = createUserToken