const express = require('express')

const router = express.Router()
const handleError = require('../helpers/handleError.helper')

router.use('/admin', require('./admin.route'))

router.use('/user', require('./user.route'))

router.use('/res', require('./restaurant.route'))

module.exports = router
