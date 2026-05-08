const router = require('express').Router()
const UserController = require('../controllers/UserController')

// helpers
const verifyToken = require('../helpers/verify-token')

// ------------------------ routes ------------------------ //

router.post('/register', verifyToken({ role: ['admin'] }), UserController.register)
router.post('/login', UserController.login)
router.get('/all', verifyToken({ role: ['admin'] }), UserController.getAllUsers)
router.get('/me', verifyToken({ role: ['admin', 'librarian'] }), UserController.getCurrentUser)
router.get('/:id', verifyToken({ role: ['admin', 'librarian'] }), UserController.getUser)
router.patch('/:id', verifyToken({ role: ['admin', 'librarian'] }), UserController.updateUser)
router.delete('/:id', verifyToken({ role: ['admin'] }), UserController.deleteUser)

module.exports = router