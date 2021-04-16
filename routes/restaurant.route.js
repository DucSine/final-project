const express = require('express')

const router = express.Router()

const handleError = require('../helpers/handleError.helper')

const { protect } = require('../middlewares/user/auth')

router.use('/auth', require('./restaurant/auth.route'))
router.use(handleError)

module.exports = router