const express = require('express')
const router = express.Router()
const Response = require('../helpers/response.helper')

const { 
    resIndex, 
    checkEmail,
    authToken 
} = require('../controllers/general.controller')

router.get('/', resIndex)
router.get('/api/auth/checkemail', checkEmail)

router.get('/auth', authToken )
module.exports = router