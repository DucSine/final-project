const fs = require('fs-promise')

const cloudinary = require('../../config/cloudinaryConfig')
const Food = require('../../models/Food')

const { io } = require('../../helpers/handleSocketIo.helper')
const Response = require('../../helpers/response.helper')
const { Error } = require('mongoose')

const Restaurant = require('../../models/Restaurant')
const Star = require('../../models/Star')
const User = require('../../models/User')
const Cart = require('../../models/Cart')
const Comment = require('../../models/Comment')
const Bill = require('../../models/Bill')
const BillDetail = require('../../models/Bill_Detail')
const Discount_code = require('../../models/Discount_code')
const Messages = require('../../models/Messages')
const limit = 20

//Danh sách mã giảm giá 
exports.publicDiscountCode = async (req, res, next) => {
  try {
    let public = await Discount_code.find({ user: null, dateExprite: { $gte: new Date() } })
    if (!public)
      throw new Error('Không có mã giảm giá.')

    return Response.success(res, { public })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.privateDiscountCode = async (req, res, next) => {
  try {
    let private = await Discount_code.find({ user: req.user._id, dateExprite: { $gte: new Date() } })

    if (!private)
      throw new Error('Không có mã giảm giá.')

    return Response.success(res, { private })
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
  try {
    let food = await Food.findById(foodID)
    if (!food)
      throw new Error('Món không tồn tại!')

    let cartExists = await Cart.findOne({ food: food._id })
    if (cartExists)
      throw new Error('Món đã tồn tại trong giỏ hàng, bạn muốn cập nhật số lượng sản phẩm?')

    let rs = await Cart.create({
      user: req.user.id,
      food: food._id,
      amount,
      restaurant: food.restaurant
    })
    if (!rs)
      throw new Error('Có lỗi xảy ra.')

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

    if (amount == 0)
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
      .populate('restaurant')
    if (!cart)
      throw new Error('Không có sản phẩm!')

    const cartAmount = await Cart.find({ user: req.user._id }).count()
    return Response.success(res, { cart, cartAmount })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.getRestaurantById = async (req, res, next) => {
  const res_id = req.query.res_id
  try {
    let restaurant = await Restaurant.findById(res_id)
    if (!restaurant)
      throw new Error('Nhà hàng không tồn tại')

    return Response.success(res, { restaurant })
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

    var star = Math.ceil(Number(rate))
    if (star > 5 && star < 0)
      throw new Error('Có lỗi xảy ra!')

    await Star.create({
      rate: star,
      food: food._id,
      user: req.user._id
    })

    /// tính rate trung bình, cập nhật rate tring food
    const rate_amount = await Star.find({ food: foodID }).count()
    var rate_sum = 0
    _rate = await Star.find({ food: foodID })

    for (var i = 0; i < rate_amount; i++) {
      rate_sum += Number(_rate[i].rate)
      console.log('item: ' + _rate[i])
    }

    const rate_avg = (rate_sum / rate_amount).toFixed(1)

    await Food.findByIdAndUpdate(foodID, { $set: { rate: rate_avg } })

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
    restaurant,
    code,
    food,
    amount
  } = req.body

  try {
    //tạo bill
    let resExist = await Restaurant.findById(restaurant)
    if (!resExist)
      throw new Error('Nhà hàng không tồn tại.')

    let create_bill

    if (code != null && code != '') {
      const discountCode = await Discount_code.find({ code })
        .sort({ dateExprite: -1 })

      if (!discountCode)
        throw new Error('Mã giảm giá không hợp lệ.')

      if (discountCode[0].restaurant != null && discountCode[0].restaurant != restaurant)
        throw new Error('Mã giảm giá không áp dụng cho đơn hàng này.')

      if (Number(discountCode[0].dateExprite) <= Date.now())
        throw new Error('Mã giảm giá đã hết hạn sử dụng.')

      if (discountCode[0].amount <= 0)
        throw new Error('Mã giảm giá đã hết lượt sử dụng.')

      create_bill = await Bill.create({
        restaurant,
        user: req.user._id,
        discount_code: discountCode[0]._id
      })
    }
    else {
      create_bill = await Bill.create({
        restaurant,
        user: req.user._id
      })
    }
    if (!create_bill)
      throw new Error('Có lỗi xảy ra khi tạo bill.')

    //add product to bill
    let total_money = 0
    var rs

    if (typeof food != 'string') {
      for (var i in food) {
        var foodItem = await Food.findById(food[i])
        if (!foodItem)
          throw new Error('Có lỗi xảy ra.')

        var bill_detail = await BillDetail.create({
          food: food[i],
          amount: amount[i],
          bill: create_bill._id
        })
        if (!bill_detail)
          throw new Error('Có lỗi xảy ra.')

        total_money += (foodItem.price * amount[i])
      }
    } else {
      var bill_detail = await BillDetail.create({
        food: food,
        amount: amount,
        bill: create_bill._id
      })

      if (!bill_detail)
        throw new Error('Có lỗi xảy ra.')

      var foodItem = await Food.findById(food)
      total_money += (foodItem.price * amount)
    }

    const billUpdate = await Bill.findByIdAndUpdate(create_bill._id, { $set: { total: total_money } }, { useFindAndModify: false })
    if (!billUpdate)
      throw new Error('Có lỗi xảy ra.')

    const totalMail = await Bill.find({ restaurant, status: 'đang xử lý' }).count()

    rs = await Bill.findByIdAndUpdate(create_bill._id, { $set: { sort: totalMail - 1 } })
    if (!rs)
      throw new Error('Có lỗi xảy ra.')

    let message_io = {
      message: 'Có đơn hàng mới, vui lòng kiểm tra.',
      total: totalMail
    }
    const sortMessages = await Messages.find().count()
    rs = await Messages.create({
      object: restaurant,
      title: 'billMessage',
      message: message_io.message,
      sort: sortMessages - 1
    })
    if (!rs)
      throw new Error('Có lỗi xảy ra.')

    io.to(restaurant.toString()).emit('billMessage', message_io)

    return Response.success(res, { message :'Đặt hàng thành công.'})

  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.delBillById = async (req, res, next) => {
  const bill_id = req.query.bill_id

  try {
    let rs = await Bill.findOneAndDelete({ _id: bill_id, status: 'đang xử lý', total: 0 })
    if (!rs)
      throw new Error('Có lỗi xảy ra.')

    return Response.success(res, { message: 'Xóa thành công' })
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

exports.removeFoodsInCart = async (req, res, next) => {
  const cart_id = req.body.cart_id

  try {
    if (typeof cart_id != 'string') {
      for (var i in cart_id) {
        var rs = await Cart.findByIdAndDelete(cart_id[i])
        if (!rs)
          throw new Error('Có lỗi xảy ra.')
      }
    } else {
      var rs = await Cart.findByIdAndDelete(cart_id)
      if (!rs)
        throw new Error('Có lỗi xảy ra.')
    }


    return Response.success(res, { message: 'Cập nhật thành công.' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.notifications = async (req, res, next) => {
  try {
    const notifications_list = await Messages.find({ object: req.user.id })
      .sort({ sort: -1 })
    let total = 0
    let not_watched = 0

    console.log(notifications_list)
    if (!notifications_list)
      throw new Error('Không có thông báo mới.')
    else {
      total = await Messages.find({ object: req.user.id }).count()
      not_watched = await Messages.find({ object: req.user.id, isWatched: false }).count()
    }

    return Response.success(res, { notifications_list, total, not_watched })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.setWatchedNotifications = async (req, res, next) => {
  const notice_id = req.query.notice_id
  try {
    let notice = await Messages.findById(notice_id)
    if (!notice)
      throw new Error('Có lỗi xảy ra.')

    if (notice.isWatched == false) {
      let rs = await Messages.findByIdAndUpdate(notice_id, { $set: { isWatched: true } })
      if (!rs)
        throw new Error('Có lỗi xảy ra.')
    }

    return Response.success(res, { message: 'Cập nhật thành công.' })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
