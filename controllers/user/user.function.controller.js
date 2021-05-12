const fs = require('fs-promise')

const cloudinary = require('../../config/cloudinaryConfig')
const Food = require('../../models/Food')

const Response = require('../../helpers/response.helper')
const { Error } = require('mongoose')

const Star = require('../../models/Star')
const User = require('../../models/User')
const Cart = require('../../models/Cart')
const Comment = require('../../models/Comment')
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
  console.log('user: ' + req.user)
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

exports.getTotalBill = async (req, res, next) => {
  const bill_id = req.query.bill_id
  try {
    let bill = await Bill.findById(bill_id)
    if (!bill)
      throw new Error('Đơn hàng không tồn tại.')

    var sum = 0
    var bill_detail = await BillDetail.find({ bill: bill._id })
    for (var item of bill_detail) {
      var food = await Food.findById(item.food)
      sum += (food.price * item.amount)
    }

    if (bill.discount != null) {
      var discount = await Discount_code.findById(bill.discount)
      sum = sum * Number(discount.discount) / 100
    }
    return Response.success(res, { sum })
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

exports.order = async (req, res, next) => {
  const {
    food,
    amount,
    discount
  } = req.body
  console.log(req.body)
  try {
    let foodRes = await Food.findById(food[0])
    if (!foodRes)
      throw new Error('Không hợp lệ')

    const restaurant = foodRes.restaurant
    for(var foodR of food){
      foodRes = await Food.findById(foodR)
      console.log('const: ' + restaurant)
      console.log('var: '+  foodRes.restaurant)
      console.log(restaurant != foodRes.restaurant)
      if(restaurant != foodRes.restaurant){
        throw new Error('Các sản phẩm không cùng 1 nhà hàng.')
      }
        

    }
    


    const bill = await Bill.create({
      restaurant,
      user: req.user._id
    })
    var sale = 0
    var total = 0
    var pay = 0
    var resPay = 0

    for (var index in food) {
      await BillDetail.create({
        food: food[index],
        amount: amount[index],
        bill: bill._id
      })
      var _food = await Food.findById(food[index])
      total += (amount[index] * _food.price)
    }

    if (discount != 'null') {
      var discountCode = await Discount_code.findById(discount)

      if (discountCode.restaurant != null || discountCode.restaurant != restaurant)
        throw new Error('Mã giảm giá không hợp lệ.')

      if (Number(discountCode.dateExprite) < Date.now())
        throw new Error('Mã giảm giá đã hết hạn.')

      if (Number(discountCode.amount) == 0)
        throw new Error('Mã giảm giá đã lượt sử dụng.')

      sale = Number(discountCode.discount)
      pay = total - (total * sale / 100)

      if (discount != 'null')
        resPay = pay - (pay * 10 / 100)
      else
        resPay = total - (total * 10 / 100)
    } else {
      pay = total
      resPay = pay - (pay * 10 / 100)
    }

    var billUpdate = await Bill.findByIdAndUpdate(
      { _id: bill._id },
      { $set: { total, pay, resPay } },
      { new: true, useFindAndModify: false }
    )

    return Response.success(res, { billUpdate })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}