//check username exists
//check email exists

const express = require('express')
const router = express.Router()
const Response = require('../helpers/response.helper')

const { emailIsExists } = require('../config/general')
const { response } = require('express')
router.get('/checkemail', async(req, res, next)=>{
    const email = req.query.email
    if(!await(emailIsExists(email)))
        Response.success(res,{message: 'true'})
    Response.error(res,{message:'false'})
})
module.exports = router