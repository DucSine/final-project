const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const crypto = require('crypto')

const sendEmail = require('../../utils/sendEmail')
const Response = require('../../helpers/response.helper')
const { 
  compareOTP, 
  generateOTP 
} = require('../../config/general')

//Đăng nhập
exports.login = async (req, res, next) => {
  const errors = validationResult(req)

  try {
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { 
      username, 
      password 
    } = req.body

    if (username !== process.env.ADMIN_NAME)
      return next(new Error('Tên đăng nhập không đúng!'))

    const result = await bcrypt.compare(password, process.env.ADMIN_PASSWORD)

    if (!result) 
      return next(new Error('Password sai!'))

    const payload = {
      admin: {
        username,
        password
      },
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => err ? next(err) : Response.success(res, { token })
    )

    return true
  } catch (error) {
    console.log(error)
    return next(new Error('Có lỗi xảy ra!'))
  }
}

//Quên mật khẩu
exports.forgotPassword = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const { email } = req.body

  if (email !== process.env.ADMIN_EMAIL)
    return next(new Error('Email sai!'))

  try{
    //TẠO OTP
    const otpCode = await generateOTP(email)
    if(otpCode == null)
      throw new Error('Có lỗi xảy ra!')

    //SEND MAIL
    const eMessage = `Xin chào ${process.env.ADMIN_NAME}!`
                    +`\nMã OTP của bạn là ${otpCode} `
                    +`\nVui lòng bỏ qua nếu không phải bạn.`
    await sendEmail({
      email: email,
      subject: 'Xác thực tài khoản',
      message: eMessage,
    })

    return Response.success(res, {
      message: 'Vui lòng kiểm tra email và nhập mã OTP'
    })
  }catch(error){
    console.log(error)
    return next(error)
  }
}

// Xác thực OTP
exports.otpResetPassword = async(req, res, next) =>{
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const { OTP } = req.body
  
  try{ 
    const rs = await compareOTP(process.env.ADMIN_EMAIL, OTP)
    if(!rs)
      return Response.error(res, {message: 'OTP không hợp lệ!'})
  
    return Response.success(res, {message: 'OTP hợp lệ.'})
    }catch(err){
      console.log(error.message)
      return next(error)
    }
}

// Nhập mk mới - login 
exports.resetPassword = async(req, res, next) =>{
// Validate
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const { newPassword } = req.body

  try{
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt)  
    await User.findByIdAndUpdate(user._id, {$set :{ password }})

    const payload = {
      admin: {
        username,
        password
      },
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => err ? next(err) : Response.success(res, { token })
    )
    
    return true
  }catch(error){
    console.log(error)
    return next(error)
  }

}

// Đổi mật khẩu
exports.changePassword = async(req, ré, next) =>{
  const {
    password,
    newPassword,
  } = req.body

  if(password == newPassword)
    throw new Error('Mật khẩu mới phải khác mật khẩu cũ.')

  try {
    const salt = await bcrypt.genSalt(10);
    process.env.ADMIN_PASSWORD = await bcrypt.hash(newPassword, salt)
    
    return Response.success(res, {message: 'Đổi mật khẩu hoàn tất.'})
  } catch (error) {
    console.log(error)
    return next(error)
  }
}