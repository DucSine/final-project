const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const crypto = require('crypto')
// const path = require('path')
const { validationResult } = require('express-validator')

// Models
const User = require('../../models/User')
const Restaurant = require('../../models/Restaurant')
const OTP = require('../../models/OTP')

const sendEmail = require('../../utils/sendEmail')
const Response = require('../../helpers/response.helper')

const sendMailVerify = async(user) =>{
  //generate otp code
  const OTPcode = 'FO-'
  for(var i = 0; i <= 5; i++)
    OTPcode += Math.floor(Math.random() * 10)

  try{
    // insert opt to database
    const otpExpire = Date.now() + 24 * 60 * 60 * 1000 
    await OTP.create({
      email: user.email, 
      OTP,
      otpExpire: otpExpire 
    })

    //send email
    const verifitonMessage = `Xin chào ${user.username}! `
                            + `\nMã xác thực của ban là ${OTPcode}. ` 
                            + `\nCó hiệu lực trong vòng 24h kể từ khi bạn nhận được email này,`
                            + ` vui lòng bỏ qua nếu không phải bạn.` 
    
    await sendEmail({
      email: user.email,
      subject: 'Xác thực tài khoản',
      message: verifitonMessage
    })

    return true
  }catch(error){
    console.log(error)
    return error.message
  }
}

//Đăng ký
exports.register = async (req, res, next) => {
  // Validate
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const {
    username,
    email,
    password,
    phone,
    adress,
    fullName,
    gender,
    bDate, //dd/mm/yyyy
    ID,
  } = req.body

  try {
    let user = await User.findOne({ email })

    if (user)
      throw new Error('Email đã được sử dụng!')
    else{
      user = await Restaurant.findOne({ email })
      if (user)
        throw new Error('Email đã được sử dụng!')
      else
        user = null
    }

    user = await User.findOne({ username })

    if (user)
      throw new Error('Username đã được sử dụng!')

    const dateParts = bDate.split('/')

    // Tạo ra salt mã hóa
    const salt = await bcrypt.genSalt(10);
    user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, salt),
      phone,
      adress,
      fullName,
      gender,
      ID,
      bDate: new Date( // dd/mm/yyyy
        parseInt(dateParts[2], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[0], 10),
      )
    })
    //verifition account
    sendMailVerify(user)
  
    const message = `Chúng tôi đã gửi một email kèm theo mã OTP đến ${email},`
                  + `vui lòng kiểm tra email vủa bạn và nhập mã OTP để kích hoạt tài khoản`
    return Response.success(res, { message: message})
  } catch (error) {
    console.log(error.message)
    return next(error)
  }
}

//Thay đổi email đăng ký
exports.editEmailRegister = async(req, res, next) =>{
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })
  
  const { 
    username,
    email 
  } = req.body

  try{
    let user = await User.findOne({username})
    if(!user)
      throw new Error('Có lỗi xảy ra!')
    
    const userID = user._id

    await User.findByIdAndUpdate(userID, { $set: { email: email } })

    sendMailVerify(User)
    //
    return Response.success(res, { message: 'Cập nhật thành công' });
  }catch(error){
    console.log(error)
    return next(error)
  }
}

//Xác thực tài khoản
exports.verificationAccount = async(req, res, next) =>{
  const {
    email,
    OTP
  } = req.body

  try{
    let otpCode = await OTP.findOne({ email })
  if(!otpCode)
    throw new Error('OTP không hợp lệ!')
  
  otpCode = await OTP.findOne({ OTP })
  var expire = 0
  if(otpCode)
    expire = Number(otpCode.otpExpire)
  else
    throw new Error('OTP không hợp lệ!')
  
  if(expire < Date.now())
    throw new Error('OTP đã hết hạn!')  
  
  let user = User.findOne({ email })
  if(!user)
    throw new Error('OTP không hợp lệ')
  
  await User.findByIdAndUpdate(user._id, { $set: { isVerified: true } })
  return Response.success(res, {message: 'Kích hoạt tài khoản thành công.'})
  }catch(err){
    console.log(error.message)
    return next(error)
  }
}

// Đăng nhập
exports.login = async (req, res, next) => {
  // Validate
  console.log(req)
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (!user) {
      throw new Error('username không đúng')
    }

    if (!user.isVerified) throw new Error('Tài khoản chưa được kích hoạt!')

    // Result: boolean
    const result = await bcrypt.compare(password, user.password)

    if (!result) {
      throw new Error('Password sai!')
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return Response.success(res, { token, avatar: user.avatar })
      },
    )
    
    return true
  } catch (error) {
    console.log(error.message)
    return next(error)
  }
}

// Đổi mật khẩu
exports.editPassword = async(req, res, next) =>{

}

// Quên mật khẩu
exports.editPassword = async(req, res, next) =>{

}


// Đổi thông tin tài khoản
exports.updateAccount = async(req, res, next) =>{
  
}

// 


/*
//edit user
exports.update = async (req, res, next) => {
  // Validate
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const { user } = req
  const { bDate } = req.body
  try {
    const currentUser = await User.findByIdAndUpdate(user._id, {
      $set: { ...req.body, ngaySinh: new Date(bDate) },
    });
    if (!currentUser) throw new Error('Có lỗi xảy ra');
    return Response.success(res, { message: 'Cập nhật thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  // Validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let {
    body: { newPassword },
  } = req;

  const {
    user,
    body: { password },
  } = req;

  try {
    // Result: boolean
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error('Bạn nhập sai mật khẩu');
    }

    // Tạo ra salt mã hóa
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id, { $set: { password: newPassword } });

    return Response.success(res, { message: 'Cập nhật thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
*/