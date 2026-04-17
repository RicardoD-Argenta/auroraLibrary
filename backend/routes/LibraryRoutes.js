const router = require('express').Router()
const LibraryController = require('../controllers/LibraryController')

// helpers
const verifyToken = require('../helpers/verify-token')

// ------------------------ routes ------------------------ //

router.post('/member/register', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.registerMember)
router.get('/member/all', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.getAllMembers)
router.get('/member/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.getMember)
router.patch('/member/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.updateMember)
router.delete('/member/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.deleteMember)

module.exports = router