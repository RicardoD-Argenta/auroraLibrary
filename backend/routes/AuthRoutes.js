const router = require('express').Router()
const UserController = require('../controllers/UserController')

// helpers
const verifyToken = require('../helpers/verify-token')

// ------------------------ routes ------------------------ //

router.post('/register', verifyToken({ role: ['architect', 'admin', 'librarian'] }), UserController.register)

module.exports = router