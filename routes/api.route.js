const express = require('express')

const router = express.Router()
const handleError = require('../helpers/handleError.helper')
const{
    checkEmail,
    resAuthToken 
} = require('../controllers/general.controller')


router.use('/user', require('./user.route'))
router.use(handleError)

router.use('/cus', require('./cus.route'))
router.use(handleError)

router.use('/res', require('./restaurant.route'))
router.use(handleError)

router.use('/admin', require('./admin.route'))
router.use(handleError)

// @route   GET /api/auth/checkemail
// @desc    check mail exists
// @access  Public
router.get('/auth/checkemail', checkEmail)

// @route   GET /api/auth/checkemail
// @desc    verification restaurant Account 
// @access  Public
router.get('/authRes', resAuthToken )


module.exports = router
