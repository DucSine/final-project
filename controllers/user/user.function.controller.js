const fs = require('fs-promise')

const cloudinary = require('../../config/cloudinaryConfig')
const Food = require('../../models/Food')

const Response = require('../../helpers/response.helper')
const Star = require('../../models/Star')
const User = require('../../models/User')
const Cart = require('../../models/Cart')
const Comment = require('../../models/Comment')
const { Error } = require('mongoose')
const Bill = require('../../models/Bill')
const BillDetail = require('../../models/Bill_Detail')
const Discount_code = require('../../models/Discount_code')
const limit = 20

//Danh sách mã giảm giá 
exports.publicDiscountCode = async (req, res, next) => {
  try {
    let public = await Discount_code.find({ user: null })
    if (!public)
      throw new Error('Không có mã giảm giá.')
    Response.success(res, { public })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.privateDiscountCode = async (req, res, next) => {
  try {
    let private = await Discount_code.find({ user: req.user._id })
    if (!private)
      throw new Error('Không có mã giảm giá.')
    Response.success(res, { private })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Thêm vào giỏ hàng
exports.addCart = async (req, res, next) => {
  const {
    foodID,
    amount
  } = req.body
  console.log('user: '+  req.user)
  console.log(req.body)
  try {
    let food = await Food.findById(foodID)
    console.log(food)
    if (!food)
      throw new Error('Món không tồn tại!')

    await Cart.create({
      user: req.user.id,
      food: food._id,
      amount
    })

    return Response.success(res, { message: 'Thêm thành công.' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Update giỏ hàng
exports.updateCart = async (req, res, next) => {
  const {
    foodID,
    amount
  } = req.body

  try {
    let food = await Food.findById(foodID)
    if (!food)
      throw new Error('Món không tồn tại!')

    if (Number(amount) == 0)
      await Cart.findOneAndDelete({ food: food._id })
    else
      await Cart.findOneAndUpdate({ food: food._id }, { $set: { amount } })

    return Response.success(res, { message: 'Cập nhật thành công.' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Xem giỏ hàng
exports.showCart = async (req, res, next) => {

  try {
    // đếm món
    let cart = await Cart.find({ user: req.user._id })
    .populate('food')
    if (!cart)
      throw new Error('Không có sản phẩm!')

    const cartAmount = await Cart.find({ user: req.user._id }).count()
    return Response.success(res, { cart, cartAmount })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

// Đặt hàng
//tạo bill
exports.createBill = async (req, res, next) => {
  const {
    restaurant,
    discountCode //id
  } = req.body
  try {
    const discount = await Discount_code.findById( discountCode)
    if (!discount)
      throw new Error('Mã giảm giá không tồn tại.')

    if (Number(discount.dateExprite) < Date.now())
      throw new Error('Mã giảm giá đã hết hạn.')

    if (Number(discount.amount) == 0)
      throw new Error('Mã giảm giá đã hết.')

    // var discount = ''
    // if (discountCode)
    //   discount = discountCode

    let bill = await Bill.create({
      restaurant,
      user: req.user._id,
      discount: discount._id
    })
      
    var current_amount = Number(discount.amount)-1
    await Discount_code.findByIdAndUpdate(discount._id, {$set: {amount: current_amount}})
    
    Response.success(req, { bill_id: bill._id })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
//add sp vào bill
exports.addFoodToBill = async (req, res, next) => {
  const {
    bill,
    food,
    amount
  } = req.body

  try {
    const rs = await BillDetail.create({
      bill,
      food,
      amount
    })
    if (!rs)
      throw new Error('Có lỗi xảy ra.')

    Response.success(res, { message: 'Tạo thành công.' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.showBillDetail = async (req, res, next) => {
  const bill_id = req.query.bill_id

  try {
    const bill = await Bill.findById(bill_id)
    if (!bill)
      throw new Error('Đơn hàng không tồn tại.')

    const bill_detail = await BillDetail.find({ bill: bill_id })
    if (!bill_detail)
      throw new Error('Không có sản phẩm.')

    return Response.success(res, { bill_detail })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Hủy Đơn hàng
exports.cancelOrder = async (req, res, next) => {
  const bill_id = req.query.bill_id
  try {
    let bill = await Bill.findById(bill_id)
    if (!bill)
      throw new Error('Đơn hàng không tồn tại.')

    if (bill.status != 'đang xử lý')
      throw new Error('Đơn hàng không thể hủy vì đang được giao hoặc đã hoàn tất.')

    await Bill.findByIdAndUpdate(bill_id, { $set: { status: 'Đã hủy' } })

    Response.success(res, { message: 'Đã hoàn tất.' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Lịch sử giao dịch
exports.getHistoryTransaction = async (req, res, next) => {
  try {
    let hisTran = await Bill.find({ user: req.user._id })
    if (!hisTran)
      throw new Error('Không có giao dịch nào.')

    Response.success(res, { hisTran })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}


//Đánh giá 
exports.rate = async (req, res, next) => {
  try {
    const {
      foodID,
      rate
    } = req.body

    const food = await Food.findById(foodID)
    if (!food)
      throw new Error('Có lỗi xảy ra!')

    let _rate = await Star.findOne({
      user: req.user._id,
      food: food._id
    })
    if (_rate)  // Đã đánh giá sp
      throw new Error('Có lỗi xảy ra!')

    const star = Math.ceil(Number(rate))
    if (star > 5 && star < 0)
      throw new Error('Có lỗi xảy ra!')

    await Star.create({
      rate: star,
      food: food._id,
      user: req.user._id
    })

    /// tính rate trung bình, cập nhật rate tring food
    const rate_amount = await Star.find({ food: foodID }).count()
    const rate_sum = 0
    _rate = await Star.find({ food: foodID })
    for (var i = 0; i < rate_amount; i++)
      rate_sum += Number(_rate[i].rate)

    const rate_avg = (rate_sum / rate_amount).toFixed(1)
    await Food.findByIdAndUpdate(food._id, { $set: { rate: rate_avg } })

    return Response.success(res, { message: 'Đánh giá thành công' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Chỉnh sửa đánh giá
exports.editRate = async (req, res, next) => {
  try {
    const {
      foodID,
      rate
    } = req.body

    const food = await Food.findById(foodID)
    if (!food)
      throw new Error('Có lỗi xảy ra!')

    let _rate = await Star.findOne({
      user: req.user._id,
      food: food._id
    })
    if (!_rate)  // đánh giá không tồn tại
      throw new Error('Có lỗi xảy ra!')

    const star = Math.ceil(Number(rate))
    if (star > 5 && star < 0)
      throw new Error('Có lỗi xảy ra!')

    await Star.findByIdAndUpdate(_rate._id, { $set: { rate: star } })
    //
    /// tính rate trung bình, cập nhật rate tring food
    const rate_amount = await Star.find({ food: foodID }).count()
    const rate_sum = 0
    _rate = await Star.find({ food: foodID })
    for (var i = 0; i < rate_amount; i++)
      rate_sum += Number(_rate[i].rate)

    const rate_avg = (rate_sum / rate_amount).toFixed(1)
    await Food.findByIdAndUpdate(food._id, { $set: { rate: rate_avg } })


    return Response.success(res, { message: 'Đánh giá thành công' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

// Bình luận
exports.comment = async (req, res, next) => {
  try {
    const {
      foodID,
      comment
    } = req.body

    const food = await Food.findById(foodID)
    if (!food)
      throw new Error('Có lỗi xảy ra!')

    if (comment.trim() == null || comment.trim() == '')
      throw new Error('Không có bình luận')

    await Comment.create({
      food: food._id,
      user: req.user._id,
      message: comment
    })

    return Response.success(res, { message: 'Bình luận thành công' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

///

