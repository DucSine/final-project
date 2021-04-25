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
        let verified = await Restaurant.findByIdAndUpdate(decode.restaurant.id, {$set: { isVerified: true }})
        //if(verified)
        //thanhf cong

    } catch (error) {

    }


}