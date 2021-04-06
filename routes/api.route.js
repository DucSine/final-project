const express = require('express')

const router = express.Router()
const handleError = require('../helpers/handleError.helper')

router.use('/admin', require('./admin.route'))


module.exports = router
