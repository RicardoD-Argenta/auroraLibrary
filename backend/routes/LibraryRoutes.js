const router = require('express').Router()
const LibraryController = require('../controllers/LibraryController')

// helpers
const verifyToken = require('../helpers/verify-token')

// ------------------------ routes ------------------------ //

// member
router.post('/member/register', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.registerMember)
router.get('/member/all', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.getAllMembers)
router.get('/member/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.getMember)
router.patch('/member/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.updateMember)
router.delete('/member/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.deleteMember)

// Sector
router.post('/sector/register', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.registerSector)
router.get('/sector/all', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.getAllSectors)
router.get('/sector/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.getSector)
router.patch('/sector/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.updateSector)
router.delete('/sector/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.deleteSector)

// Shelf
router.post('/shelf/register', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.registerShelf)
router.get('/shelf/all', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.getAllShelves)
router.get('/shelf/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.getShelf)
router.patch('/shelf/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.updateShelf)
router.delete('/shelf/:id', verifyToken({ role: ['admin', 'librarian'] }), LibraryController.deleteShelf)

module.exports = router