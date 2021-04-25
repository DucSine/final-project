const express = require('express')
const router = express.Router()
const Response = require('../helpers/response.helper')

const { 
    resIndex, 
    checkEmail,
    authToken 
} = require('../controllers/general.controller')

// @route   GET /
// @desc    restaurant index
// @access  Public
router.get('/', resIndex)

// @route   GET /api/auth/checkemail
// @desc    check mail exists
// @access  Public
router.get('/api/auth/checkemail', checkEmail)


// @route   GET /api/auth/checkemail
// @desc    verification Account
// @access  Public
router.get('/auth', authToken )

module.exports = router