const Response = require('../helpers/response.helper')

const {
    emailIsExists,
    decodeAuthToken
} = require('../config/general')
const Restaurant = require('../models/Restaurant')

exports.resIndex = async (req, res) => res.render('./restaurant/index')

exports.checkEmail = async (req, res, next) => {
    const email = req.query.email
    if (!await (emailIsExists(email)))
        Response.success(res, { message: 'true' })
    Response.error(res, { message: 'false' })
}

exports.authToken = async (req, res, next) => {
    const tokenAuth = req.query.tokenAuth
    try {
        const decode = decodeAuthToken(tokenAuth)
        if(!decode){
            res.send("<script>alert('Link đã hết hạn.')</script>")   
            return false
        }
        await Restaurant.findByIdAndUpdate(decode.restaurant.id, {$set: { isVerified: true }})
        res.send("<script>alert('Tài khoản đã được kích hoạt thành công.')</script>")
        return true
        
    } catch (error) {
        console.log(error.message)
        return next(error)
    }
}