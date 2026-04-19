const router = require('express').Router()
const BookController = require('../controllers/BookController')

// helpers
const verifyToken = require('../helpers/verify-token')

// ------------------------ routes ------------------------ //

// publisher
router.post('/publisher/register', verifyToken({ role: ['admin', 'librarian'] }), BookController.registerPublisher)
router.get('/publisher/all', verifyToken({ role: ['admin', 'librarian'] }), BookController.getAllPublishers)
router.get('/publisher/:id', verifyToken({ role: ['admin', 'librarian'] }), BookController.getPublisher)
router.patch('/publisher/:id', verifyToken({ role: ['admin', 'librarian'] }), BookController.editPublisher)
router.delete('/publisher/:id', verifyToken({ role: ['admin', 'librarian'] }), BookController.deletePublisher)

// author
router.post('/author/register', verifyToken({ role: ['admin', 'librarian'] }), BookController.registerAuthor)
router.get('/author/all', verifyToken({ role: ['admin', 'librarian'] }), BookController.getAllAuthors)
router.get('/author/:id', verifyToken({ role: ['admin', 'librarian'] }), BookController.getAuthor)
router.patch('/author/:id', verifyToken({ role: ['admin', 'librarian'] }), BookController.editAuthor)
router.delete('/author/:id', verifyToken({ role: ['admin', 'librarian'] }), BookController.deleteAuthor)

module.exports = router