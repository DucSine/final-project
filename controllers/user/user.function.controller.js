const fs = require('fs-promise')

const cloudinary = require('../../config/cloudinaryConfig')
const Food = require('../../models/Food')

const Response = require('../../helpers/response.helper')
const Star = require('../../models/Star')
const User = require('../../models/User')
const { Error } = require('mongoose')
const limit = 20

//Thêm vào giỏ hàng
exports.addCart = async(req, res, next)=>{}

//Update giỏ hàng
exports.updateCart = async(req, res, next)=>{}

// Đặt hàng
exports.order = async(req, res, next)=>{}

//Hủy Đơn hàng
exports.cancelOrder = async(req, res, next)=>{}

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

    const _rate = await Star.findOne({
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

    const _rate = await Star.findOne({
      user: req.user._id, 
      food: food._id
    })
    if(!_rate)  // đánh giá không tồn tại
      throw new Error('Có lỗi xảy ra!')

    const star =  Math.ceil(Number(rate))
    if(star > 5 && star < 0)
      throw new Error('Có lỗi xảy ra!')

    await Star.findByIdAndUpdate(_rate._id, { $set: {rate: star}} )

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

//Chỉnh sửa bình luận
exports.editComment = async(req, res, next)=>{}

//Xóa bình luận
exports.deleteComment = async(req, res, next)=>{}

///

