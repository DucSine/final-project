const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { validationResult } = require('express-validator')

const Response = require('../helpers/response.helper')
// Models
const RestaurantType = require('../models/RestaurantType')
const Restaurant = require('../models/Restaurant')
const Food = require('../models/Food')
const User = require('../models/User')

const limit = 20
const { emailIsExists } = require('../config/general')
// res
exports.addResType = async(req,res,next)=>{
    const errors = validationResult(req);
    
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { typeName } = req.body;
  
    try {
      let resType = await RestaurantType.findOne({ typeName });
  
      if (resType) {
        throw new Error('Loại hình đã tồn tại');
      }  
      resType = await RestaurantType.create({ typeName });
  
      return Response.success(res, { message: 'Thêm thành công' });
    } catch (error) {
      console.log(error.message);
      return next(error);
    }
}

exports.addRes = async (req, res, next)=>{
    const errors = validationResult(req) 
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const{
      restaurantName,
      email,
      phone,
      address,
      type,
    } = req.body
    const password = 'duc231097'
/////////////
    console.log(req.body)
  try{
      let restaurant = await Restaurant.findOne({ restaurantName });
      if (restaurant) throw new Error('Tên nhà hàng đã tồn tại');
  
      if(await emailIsExists(email))
        throw new Error('Email đã tồn tại');
  
      const restaurantType = await RestaurantType.findById(type);
  
      if (!restaurantType) throw new Error('Loại hình không tồn tại');
      const salt = await bcrypt.genSalt(10);
      await Restaurant.create({
        restaurantName,
        email,
        password: await bcrypt.hash(password, salt),
        phone: phone,
        type: restaurantType._id,
        address,
        isVerified:true,
        
      });
  
      return Response.success(res, { message: 'Bạn đã đăng ký thành công' });
    } catch (error) {
      console.log(error);
      return next(error);
    }
}

//foods
exports.addFood = async (req,res,next)=>{
  const errors = validationResult(req)
    
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    file,
    body: {
      foodName,
      rate,
      price,
      caption,
      restaurantID,
    }
  } = req

  console.log(req.body )
  try {
    let food = await Food.findOne({ foodName, restaurantID });
    if (food)  throw new Error('Món đã tồn tại');
    
    const restaurant = await Restaurant.findById(restaurantID)
    if(!res) throw new Error('res k tồn tại');
    
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

    food = await Food.create({ 
      foodName,
      restaurant: restaurant._id,
      rate,
      price,
      caption, 
      image : urlUpload
    });
  
    return Response.success(res, { message: 'Thêm thành công' });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }  
}

//user
exports.addUser = async (req, res, next)=>{
  const errors = validationResult(req)
  
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  
  const {
    username,
    password,
    fullName,
    phone,
    adress,
    bDate,
    ID,
    gender,
    email
  } = req.body

  console.log(req.body )
  try {
    let user = await User.findOne({ username });
    if (user)  throw new Error('tài khoản đã tồn tại');
    
    user = await User.findOne({email})
    if (user)  throw new Error('email đã tồn tại');

    const dateParts = bDate.split('/');

    const salt = await bcrypt.genSalt(10);
    user = await User.create({ 
      username,
      password: await bcrypt.hash(password, salt), 
      fullName,
      phone,
      adress,
      bDate: new Date(
        parseInt(dateParts[2], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[0], 10),
      ),
      ID,
      gender,
      email, 
      isVerified: true,
    });
  
    return Response.success(res, { message: 'Thêm thành công' });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }

}