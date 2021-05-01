const express = require('express')

const router = express.Router()

const handleError = require('../helpers/handleError.helper')
const { protect } = require('../middlewares/restaurant/auth')

router.use('/func', require('./restaurant/res.function.route'))
router.use(handleError)

router.use('/auth', require('./restaurant/auth.route'))
router.use(handleError)

module.exports = router