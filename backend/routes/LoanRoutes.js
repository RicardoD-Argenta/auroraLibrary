const router = require('express').Router()
const LoanController = require('../controllers/LoanController')

// helpers
const verifyToken = require('../helpers/verify-token')

// ------------------------ routes ------------------------ //

// loan
router.post('/register', verifyToken({ role: ['admin', 'librarian'] }), LoanController.registerLoan)

module.exports = router