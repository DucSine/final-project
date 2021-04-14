const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//upload file
const cloudinary = require('../../config/cloudinaryConfig')
//validate
const { validationResult } = require('express-validator')

// Models
const User = require('../../models/User')
const Restaurant = require('../../models/Restaurant')
const sendEmail = require('../../utils/sendEmail')
const Response = require('../../helpers/response.helper')
const { 
  emailIsExists, 
  generateOTP, 
  compareOTP 
} = require('../../config/general')

//Đăng ký
exports.register = async (req, res, next) => {
  // Validate
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const {
    file,
    body: {
      username,
      email,
      password,
      phone,
      address,
      fullName,
      gender,
      bDate, //dd/mm/yyyy
      ID,   
    },
  } = req
  try {
    const checkMail = await emailIsExists(email)
    if(checkMail)
      throw new Error('Email đã được sử dụng!')

    let user = await User.findOne({ username })

    if (user)
      throw new Error('Username đã được sử dụng!')

    const urlUpload = ''
    if(file){   // nếu upload ảnh đại diện 
      let orgName = file.originalname || '';
      orgName = orgName.trim().replace(/ /g, '-');
      const fullPathInServ = file.path;
      const newFullPath = `${fullPathInServ}-${orgName}`;
      fs.rename(fullPathInServ, newFullPath);

      const result = await cloudinary.uploader.upload(newFullPath);
      urlUpload = result.url
      fs.unlinkSync(newFullPath);
    }

    const dateParts = bDate.split('/')

    // Tạo ra salt mã hóa
    const salt = await bcrypt.genSalt(10);
    await User.create({
      username,
      email,
      password: await bcrypt.hash(password, salt),
      avatar: urlUpload,
      phone,
      address,
      fullName,
      gender,
      ID,
      bDate: new Date( // dd/mm/yyyy
        parseInt(dateParts[2], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[0], 10),
      )
    })
    //TẠO OTP
    const otpCode = await generateOTP(email)
    if(otpCode == null)
      throw new Error('Có lỗi xảy ra!')

    //SEND MAIL
    const eMessage = `Xin chào ${username}!`
                    +`\nMã OTP của bạn là ${otpCode} `
                    +`\nVui lòng bỏ qua nếu không phải bạn.`
    await sendEmail({
      email: email,
      subject: 'Xác thực tài khoản',
      message: eMessage,
    })
  
    const rMessage = `Chúng tôi đã gửi một email kèm theo mã OTP đến ${email},`
                  + `vui lòng kiểm tra email vủa bạn và nhập mã OTP để kích hoạt tài khoản`
    return Response.success(res, { message: rMessage})
  } catch (error) {
    console.log(error.message)
    return next(error)
  }
}

//Thay đổi email đăng ký
exports.changeEmailRegister = async(req, res, next) =>{
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
    
    const checkMail = await emailIsExists(email)
    if(checkMail)
      throw new Error('email đã được sử dụng!')

    //
    await User.findByIdAndUpdate(user._id, { $set: { email: email } })

    //TẠO OTP
    const otpCode = await generateOTP(email)
    if(otpCode == null)
      throw new Error('Có lỗi xảy ra!')

    //SEND MAIL
    const eMessage = `Xin chào ${username}!`
                    +`\nMã OTP của bạn là ${otpCode} `
                    +`\nVui lòng bỏ qua nếu không phải bạn.`
    await sendEmail({
      email: email,
      subject: 'Xác thực tài khoản',
      message: eMessage,
    })

    return Response.success(res, { message: 'Cập nhật thành công' });
  }catch(error){
    console.log(error)
    return next(error)
  }
}

//Xác thực tài khoản
exports.verificationAccount = async(req, res, next) =>{
  // Validate
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const {
    email,
    OTP
  } = req.body

  try{ 
    let user = User.findOne({ email })
    if(!user)
      throw new Error('Có lỗi xảy ra')
    
    const rs = await compareOTP(email, OTP)
    if(!rs)
      return Response.error(res, {message: 'OTP không hợp lệ!'})

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
        if (err) throw err
        return Response.success(res, { token, avatar: user.avatar })
      },
    )
    
    return true
  } catch (error) {
    console.log(error.message)
    return next(error)
  }
}

// Quên mật khẩu 
// post mail xác nhận - verificationAccount
exports.fogotPassword = async(req, res, next) =>{
  // Validate
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const { email } = req.body

  try{
    let user = await User.findOne({ email })
    if(!user)
      throw new Error('Địa chỉ email không đúng!')
    
    //TẠO OTP
    const otpCode = await generateOTP(email)
    if(otpCode == null)
      throw new Error('Có lỗi xảy ra!')

    //SEND MAIL
    const eMessage = `Xin chào ${user.username}!`
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

  const {
    email,
    OTP
  } = req.body
  
  try{ 
    let user = User.findOne({ email })
    if(!user)
      throw new Error('Có lỗi xảy ra')
      
    const rs = await compareOTP(email, OTP)
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

  const { 
    email, 
    newPassword 
  } = req.body

  try{
    let user = await User.findOne({ email })
    if (!user.isVerified) 
      throw new Error('Tài khoản chưa được kích hoạt!')
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt)  
    await User.findByIdAndUpdate(user._id, {$set :{ password }})

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
  }catch(error){
    console.log(error)
    return next(error)
  }

}

// Đổi mật khẩu
exports.changePassword = async(req, res, next) =>{
  // Validate
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const { 
    password,
    newPassword
  } = req.body

  try{
    if(password == newPassword)
      throw new Error('Mật khẩu mới phải khác mật khẩu cũ!')

    const result = await bcrypt.compare(password, req.user.password)
    if (!result) 
      throw new Error('Password sai!')
    
    const salt = await bcrypt.genSalt(10);
    const editPass = await bcrypt.hash(newPassword, salt)  
    await User.findByIdAndUpdate(user._id, {$set :{ password: editPass }})
    
    return Response.success(res,{message:'Thay đổi mật khẩu thành công.'})
  }catch(error){
    console.log(error)
    return next(error)
  }
}

// Đổi thông tin tài khoản
exports.editAccount = async (req, res, next) => {
  // Validate
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const {
    file,
    body: {
      phone,
      address,
      fullName,
      gender,
      bDate, //dd/mm/yyyy
      ID,
    }
  } = req
  try {
    const urlUpload = ''
    if(file){   // nếu đổi ảnh đại diện 
      let orgName = file.originalname || '';
      orgName = orgName.trim().replace(/ /g, '-');
      const fullPathInServ = file.path;
      const newFullPath = `${fullPathInServ}-${orgName}`;
      fs.rename(fullPathInServ, newFullPath);

      const result = await cloudinary.uploader.upload(newFullPath);
      urlUpload = result.url
      fs.unlinkSync(newFullPath);
    }

    const currentUser = await User.findByIdAndUpdate(req.user._id, {
      $set: { 
        ...req.body,
        bDate: new Date(bDate),
        avatar: urlUpload
      },
    })
    if (!currentUser) throw new Error('Có lỗi xảy ra')
    return Response.success(res, { message: 'Cập nhật thành công' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Lấy thông tin tài khoản
exports.userProfile = async (req, res, next) => Response.success(res, req.user)



//                                 >>done