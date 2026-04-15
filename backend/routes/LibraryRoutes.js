const router = require('express').Router()
const LibraryController = require('../controllers/LibraryController')

// helpers
const verifyToken = require('../helpers/verify-token')

// ------------------------ routes ------------------------ //

router.post('/member/register', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.registerMember)

module.exports = router