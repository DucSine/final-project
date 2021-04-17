const express = require('express')

const router = express.Router()
const handleError = require('../helpers/handleError.helper')

router.use('/user', require('./user.route'))
router.use(handleError)

router.use('/cus', require('./cus.route'))
router.use(handleError)

router.use('/admin', require('./admin.route'))
router.use(handleError)
module.exports = router
