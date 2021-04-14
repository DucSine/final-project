const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const OTP = require('../models/OTP')

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

//Tạo OTP
exports.generateOTP = async (email) => {
    const OTPcode = 'FO-'
    for(var i = 0; i <= 5; i++)
      OTPcode += Math.floor(Math.random() * 10)
  
    try{
      const otpExpire = Date.now() + 24 * 60 * 60 * 1000 
      await OTP.create({
        email: email, 
        OTP: OTPcode,
        otpExpire: otpExpire 
      })
      return OTPcode
    }catch(error){
        console.log(error)
        return null
    }
}

//kiểm tra OTP
exports.compareOTP = async (email, otpCode ) => {
    try{
        let otp = await OTP.findOne({ 
            email, 
            OTP: otpCode 
        })

        if(!otp) // Không tồn tại
            return false
        
        const expire = Number(otp.otpExpire)
        if(expire < Date.now())  // hết hạn
            return false

        await OTP.findByIdAndDelete(otp._id) // xóa otp 
        return true
    }catch(error){
        console.log(error)
        return false
    }
}

