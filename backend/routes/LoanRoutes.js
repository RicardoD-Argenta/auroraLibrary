const router = require('express').Router()
const LoanController = require('../controllers/LoanController')

// helpers
const verifyToken = require('../helpers/verify-token')

// ------------------------ routes ------------------------ //

// loan
router.post('/register', verifyToken({ role: ['admin', 'librarian'] }), LoanController.registerLoan)
router.get('/all', verifyToken({ role: ['admin', 'librarian'] }), LoanController.allLoans)
router.get('/:id', verifyToken({ role: ['admin', 'librarian'] }), LoanController.loanById)

module.exports = router