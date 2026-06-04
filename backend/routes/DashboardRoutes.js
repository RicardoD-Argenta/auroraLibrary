const router = require('express').Router()
const DashboardController = require('../controllers/DashboardController')

// helpers
const verifyToken = require('../helpers/verify-token')

// ------------------------ routes ------------------------ //

router.get('/', verifyToken({ role: ['admin', 'librarian'] }), DashboardController.getDashboard)

module.exports = router
