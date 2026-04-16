const router = require('express').Router()
const BookController = require('../controllers/BookController')

const verifyToken = require('../helpers/verify-token')

router.post('/create/genre', verifyToken({ role: ['admin'] }), BookController.createGenre)
router.get('/allgenres', verifyToken({ role: ['admin', 'librarian'] }), BookController.getAllGenres)
router.get('/genre/:id', verifyToken({ role: ['admin', 'librarian'] }), BookController.getGenreById)
router.patch('/genre/:id', verifyToken({ role: ['admin'] }), BookController.updateGenre)
router.delete('/genre/:id', verifyToken({ role: ['admin'] }), BookController.deleteGenreById)

module.exports = router
