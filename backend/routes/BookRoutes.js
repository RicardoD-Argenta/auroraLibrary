const router = require('express').Router()
const BookController = require('../controllers/BookController')

const verifyToken = require('../helpers/verify-token')

router.post('/create/author', verifyToken({ role: ['admin'] }), BookController.createAuthor)
router.get('/allauthors', verifyToken({ role: ['admin', 'librarian'] }), BookController.getAllAuthors)
router.get('/author/:id', verifyToken({ role: ['admin', 'librarian'] }), BookController.getAuthorById)
router.delete('/author/:id', verifyToken({ role: ['admin'] }), BookController.deleteAuthorById)
router.patch('/author/:id', verifyToken({ role: ['admin'] }), BookController.updateAuthor)

module.exports = router
