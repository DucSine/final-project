const express = require('express')

const router = express.Router()

const handleError = require('../helpers/handleError.helper')

const { protect } = require('../middlewares/user/auth')

router.use('/auth', require('./user/auth.route'))

router.use(handleError)
 
router.use('/func', require('./user/user.function.route'))

router.use(handleError)

router.use(protect)

router.use(handleError)

module.exports = router
