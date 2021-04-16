const fs = require('fs-promise')

const cloudinary = require('../../config/cloudinaryConfig')
const Food = require('../../models/Food')

const Response = require('../../helpers/response.helper')
const Star = require('../../models/Star')
const User = require('../../models/User')
const Cart = require('../../models/Cart')
const Comment = require('../../models/Comment')
const { Error } = require('mongoose')
const limit = 20

//Danh sách mã giảm giá 
exports.discountCodeList = async(req, res, next)=>{}

//Thêm vào giỏ hàng
exports.addCart = async(req, res, next)=>{
  const {
    foodID,
    amount
  } = req.body

  try{
    let food = await Food.findById(foodID)
    if(!food)
      throw new Error('Món không tồn tại!')
    
    await Cart.create({
      user: req.user._id,
      food: food._id,
      amount
    })

    return Response.success(res, {message: 'Thêm thành công.'})
  }catch(error){
    console.log(error)
    return next(error)    
  }
}

//Update giỏ hàng
exports.updateCart = async(req, res, next)=>{
  const {
    foodID,
    amount
  } = req.body

  try{
    let food = await Food.findById(foodID)
    if(!food)
      throw new Error('Món không tồn tại!')
    
    if (Number(amount) == 0)
      await Cart.findOneAndDelete({ food: food._id })
    else
      await Cart.findOneAndUpdate({ food: food._id }, { $set: { amount } })

    return Response.success(res, {message: 'Cập nhật thành công.'})
  }catch(error){
    console.log(error)
    return next(error)    
  }
}

//Xem giỏ hàng
exports.showCart = async(req, res, next)=>{
  //trả list món trong giỏ
  //phức tạp
  try {
    // đếm món
    let cart = await Cart.find({user: req.user._id})
    if(!cart)
      throw new Error('Không có sản phẩm!')
    
    const cartAmount = await Cart.find({user: req.user._id}).count()
    const foods = []
    for(var i = 0; i < cart; i++)
      foods.push(cart[i].food)
////nghĩ k ra

  } catch (error) {
    console.log(error)
    return next(error)
  }








}

// Đặt hàng
exports.order = async(req, res, next)=>{
  //lọc theo nhà hàng
  // mua ngay
  //...
}

//Hủy Đơn hàng
exports.cancelOrder = async(req, res, next)=>{}

//Lịch sử giao dịch

//Thanh toán

//Đánh giá 
exports.rate = async(req, res, next)=>{
  try{
    const {
      foodID,
      rate
    } = req.body
    
    const food = await Food.findById(foodID)
    if(!food)
      throw new Error('Có lỗi xảy ra!')

    let _rate = await Star.findOne({
      user: req.user._id, 
      food: food._id
    })
    if(_rate)  // Đã đánh giá sp
      throw new Error('Có lỗi xảy ra!')

    const star =  Math.ceil(Number(rate))
    if(star > 5 && star < 0)
      throw new Error('Có lỗi xảy ra!')

    await Star.create({
      rate: star,
      food: food._id,
      user: req.user._id
    })

    /// tính rate trung bình, cập nhật rate tring food
    const rate_amount = await Star.find({food: foodID}).count()
    const rate_sum = 0
    _rate = await Star.find({food: foodID})
    for(var i = 0; i< rate_amount; i++)
      rate_sum += Number(_rate[i].rate)

    const rate_avg = (rate_sum/rate_amount).toFixed(1)
    await Food.findByIdAndUpdate(food._id,{$set: {rate: rate_avg}})
  
    return Response.success(res,{message: 'Đánh giá thành công'})
  }catch(error){
    console.log(error)
    return next(error)
  }
}

//Chỉnh sửa đánh giá
exports.editRate = async(req, res, next)=>{
  try{
    const {
      foodID,
      rate
    } = req.body

    const food = await Food.findById(foodID)
    if(!food)
      throw new Error('Có lỗi xảy ra!')

    let _rate = await Star.findOne({
      user: req.user._id, 
      food: food._id
    })
    if(!_rate)  // đánh giá không tồn tại
      throw new Error('Có lỗi xảy ra!')

    const star =  Math.ceil(Number(rate))
    if(star > 5 && star < 0)
      throw new Error('Có lỗi xảy ra!')

    await Star.findByIdAndUpdate(_rate._id, { $set: {rate: star}} )
//
    /// tính rate trung bình, cập nhật rate tring food
    const rate_amount = await Star.find({food: foodID}).count()
    const rate_sum = 0
    _rate = await Star.find({food: foodID})
    for(var i = 0; i< rate_amount; i++)
      rate_sum += Number(_rate[i].rate)

    const rate_avg = (rate_sum/rate_amount).toFixed(1)
    await Food.findByIdAndUpdate(food._id,{$set: {rate: rate_avg}})


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
      comment
    } = req.body

    const food = await Food.findById(foodID)
    if(!food)
      throw new Error('Có lỗi xảy ra!')

    if(comment.trim() == null || comment.trim()== '')
      throw new Error('Không có bình luận')

    await Comment.create({
      food: food._id,
      user: req.user._id,
      message: comment
    })

    return Response.success(res,{message: 'Bình luận thành công'})
  }catch(error){
    console.log(error)
    return next(error)
  }
}

///

