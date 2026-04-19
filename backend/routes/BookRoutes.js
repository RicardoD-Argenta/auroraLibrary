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

module.exports = router