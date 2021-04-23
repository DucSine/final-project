const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//upload file
const cloudinary = require('../../config/cloudinaryConfig')
//validate
const { validationResult } = require('express-validator')

// Models
const User = require('../../models/User')
const RestaurantType = require('../../models/RestaurantType')
const Restaurant = require('../../models/Restaurant')
const sendEmail = require('../../utils/sendEmail')
const Response = require('../../helpers/response.helper')
const { 
  emailIsExists, 
  generateOTP, 
  compareOTP 
} = require('../../config/general')

//Đăng ký nhà hàng
exports.register = async (req, res, next) => {
  // Validate
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const {
    file,
    body: {
      restaurantName, // có thể trùng vì 1 nhà hàng có nhiều chi nhánh
      email, // duy nhất (dùng để đăng nhập)
      password,
      phone,
      address,
      type, 
    },
  } = req
  try {
    const checkMail = await emailIsExists(email)
    if(checkMail)
      throw new Error('Email đã được sử dụng!')

    let resType = await RestaurantType.findById(type)
    if(!resType)
      throw new Error('Loại hình đăng ký không tồn tại.')

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

    // Tạo ra salt mã hóa
    const salt = await bcrypt.genSalt(10);
    await Restaurant.create({
      restaurantName,
      email,
      password: await bcrypt.hash(password, salt),
      banner: urlUpload,
      phone,
      address,
      type: resType._id
    })
    //TẠO OTP
    const otpCode = await generateOTP(email)
    if(otpCode == null)
      throw new Error('Có lỗi xảy ra!')

    //SEND MAIL
    const eMessage = `Xin chào ${restaurantName}!`
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
    email,
    newEmail 
  } = req.body

  try{
    let restaurant = await Restaurant.findOne({ email })
    if(!restaurant)
      throw new Error('Có lỗi xảy ra!')
    
      const checkMail = await emailIsExists(newEmail)
    if(checkMail)
      throw new Error('email đã được sử dụng!')

    //
    await Restaurant.findByIdAndUpdate(restaurant._id, { $set: { email: newEmail } })

    //TẠO OTP
    const otpCode = await generateOTP(newEmail)
    if(otpCode == null)
      throw new Error('Có lỗi xảy ra!')

    //SEND MAIL
    const eMessage = `Xin chào ${restaurant.restaurantName}!`
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
    let restaurant = Restaurant.findOne({ email })
    if(!restaurant)
      throw new Error('Có lỗi xảy ra')
    
    const rs = await compareOTP(email, OTP)
    if(!rs)
      return Response.error(res, {message: 'OTP không hợp lệ!'})

    await Restaurant.findByIdAndUpdate(restaurant._id, { $set: { isVerified: true } })
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

  const { 
    email, 
    password 
  } = req.body

  try {
    let restaurant = await Restaurant.findOne({ email })

    if (!restaurant) 
      throw new Error('email không đúng')

    if (!restaurant.isVerified) 
      throw new Error('Tài khoản chưa được kích hoạt!')

    // Result: boolean
    const result = await bcrypt.compare(password, restaurant.password)

    if (!result) {
      throw new Error('Password sai!');
    }
    const payload = {
      restaurant: {
        id: restaurant.id,
      },
    };
   
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 432000 }, // 5 ngày
    )

    res.cookie('token',token)
    
    res.redirect('/res/hostpage')
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
    let restaurant = await Restaurant.findOne({ email })
    if(!restaurant)
      throw new Error('Địa chỉ email không đúng!')
    
    //TẠO OTP
    const otpCode = await generateOTP(email)
    if(otpCode == null)
      throw new Error('Có lỗi xảy ra!')

    //SEND MAIL
    const eMessage = `Xin chào ${restaurant.restaurantName}!`
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
    let restaurant = Restaurant.findOne({ email })
    if(!restaurant)
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
    let restaurant = await Restaurant.findOne({ email })
    if (!restaurant.isVerified) 
      throw new Error('Tài khoản chưa được kích hoạt!')
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt)  
    await Restaurant.findByIdAndUpdate(restaurant._id, {$set :{ password }})

    const payload = {
      restaurant: {
        id: restaurant.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return Response.success(res, { token, avatar: restaurant.avatar })
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
    await Restaurant.findByIdAndUpdate(restaurant._id, {$set :{ password: editPass }})
    
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
      restaurantName, // có thể trùng vì 1 nhà hàng có nhiều chi nhánh
      phone,
      address,
      type
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

    const currentRestaurant = await Restaurant.findByIdAndUpdate(req.restaurant._id, {
      $set: { ...req.body, banner: urlUpload },
    })

    if (!currentRestaurant) throw new Error('Có lỗi xảy ra')
    return Response.success(res, { message: 'Cập nhật thành công' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Lấy thông tin tài khoản
exports.resProfile = async (req, res, next) => Response.success(res, req.restaurant)



//                                 >> done <<