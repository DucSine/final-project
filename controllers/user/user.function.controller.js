const fs = require('fs-promise')

const cloudinary = require('../../config/cloudinaryConfig')
const Food = require('../../models/Food')

const Response = require('../../helpers/response.helper')
const Star = require('../../models/Star')
const User = require('../../models/User')
const { Error } = require('mongoose')
const limit = 20


//trang chủ -5 món mới nhất
exports.getNewFood = async(req,res,next)=>{
  try{
    const foods = await Food.find()
      .sort({ dateCreate: -1 })
      .populate('restaurant')
      .skip(0)
      .limit(5)

    if (!foods) 
      throw new Error('Có lỗi xảy ra')

    return Response.success(res, { foods })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//top 10 rate
exports.topRate = async(req, res, next)=>{
  try{
    const food = await Food.find()
      .sort({ rate: -1, price: 1, dateCreate: -1 })
      .populate('restaurant')
      .skip(0)
      .limit(10)

    if (!foods) 
      throw new Error('Có lỗi xảy ra')

    return Response.success( res, { foods })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Tìm kiếm món ăn
exports.findProducts = async(req, res, next)=>{
  try{
    let {key} = req.query
    
    const productsTotal = await Food.find({foodName: new RegExp(key)}).count()
    const pageTotal = Math.ceil(productsTotal / limit)

    if(productsTotal<=0)
      return Response.error(res,{message: 'Không tìm thấy!'})

    const food = await Food.find({foodName: new RegExp(key)})
    const foods = await Food.find({foodName: new RegExp(key)})
      .sort({rate:-1, price: 1 , dateCreate: -1 })
      .populate('restaurant')
      .skip((q - 1) * limit)
      .limit(limit);
      
    return Response.success(
      res, {
        food,
        productsTotal,
        pageTotal
      })
  }catch(error){
    console.log(error)
    return next(error)
  }
}

// Đánh giá 
exports.rate = async(req, res, next)=>{
  try{
    const {
      foodID,
      userID,
      rate
    } = req.body

    const food = await Food.findById(foodID)
    if(!food)
      throw new Error('Có lỗi xảy ra!')

    const user = await User.findById(userID)
    if(!user)
    throw new Error('Có lỗi xảy ra!')

    const star =  Math.ceil(Number(rate))
    if(star > 5 && star < 0)
      throw new Error('Có lỗi xảy ra!')

    await Star.create({
      rate: star,
      food: food._id,
      user: user._id
    })

    return Response.success(res,{message: 'Đánh giá thành công'})
  }catch(error){
    console.log(error)
    return next(error)
  }
}

// Bình luận
exports.comment = async(req, res, next)=>{
  try{
    const {
      foodID,
      userID,
      message
    } = req.body

    const food = await Food.findById(foodID)
    if(!food)
      throw new Error('Có lỗi xảy ra!')

    const user = await User.findById(userID)
    if(!user)
      throw new Error('Có lỗi xảy ra!')

    if(message.trim()!= null && message.trim()!='')
      return Response.error(res,{message: 'Vui lòng nhập bình luận.'})

    return Response.success(res,{message: 'Bình luận thành công.'})
  }catch(error){
    console.log(error)
    return next(error)
  }
}
///
// Đặt hàng
exports.order = async(req, res, next)=>{}

//Hủy Đơn hàng
exports.cancelOrder = async(req, res, next)=>{}

//Thêm vào giỏ hàng
exports.addCart = async(req, res, next)=>{}

//Update giỏ hàng
exports.updateCart = async(req, res, next)=>{}
//Thanh toán
