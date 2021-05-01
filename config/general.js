const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const AuthCode = require('../models/AuthCode')

//Kiểm tra email tồn tại  
exports.emailIsExists = async(email) =>{
    if(email == process.env.ADMIN_EMAIL ||
       email == process.env.SMTP_USER )
       return true
    
    const res = await Restaurant.findOne({ email })
    if(res) 
        return true
    
    const user = await User.findOne({ email })
    if(user)
        return true
    
    return false
} 

//kiểm tra OTP
exports.compareOTP = async (email, otp ) => {
    try{
        let authCode = await AuthCode.findOne({ 
            email, 
            authCode: otp
        })

        if(!authCode) // Không tồn tại
            return false
        
        const expire = Number(authCode.otpExpire)
        if(expire < Date.now())  // hết hạn
            return false

        await AuthCode.findByIdAndDelete(authCode._id) // xóa otp 
        return true
    }catch(error){
        console.log(error)
        return false
    }
}

//Tạo tokenAuth
exports.generateAuthToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 86400 }, // 1 ngày
    )
}

//Giải mã authToken
exports.decodeAuthToken = (tokenAuth) =>{
    return jwt.verify(tokenAuth, process.env.JWT_SECRET)
}