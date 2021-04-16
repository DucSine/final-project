const express = require('express')

const router = express.Router()

const handleError = require('../helpers/handleError.helper')

router.use('/', require('./customer/cus.function.route'))

router.use(handleError);

module.exports = router