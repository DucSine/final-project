const Food = require('../../models/Food')
const Response = require('../../helpers/response.helper')
const Star = require('../../models/Star')
const Comment = require('../../models/Comment')
const Restaurant = require('../../models/Restaurant')
const limit = 15
const limitNew = 10
const limitRate = 10

exports.getAllFood = async (req, res, next) => {
  const p = req.query.p
  try {
    const page = parseInt(p, 10)
    const foods_amount = await Food.find().count()
    const pageTotal = Math.ceil(foods_amount / limit)
    let foods
    if (!p) {
      foods = await Food.find()
        .sort({ rate: -1 })
        .populate('restaurant')
      console.log(foods.length)
      return Response.success(res, { foods, foods_amount })
    } else {
      foods = await Food.find()
        .sort({ rate: -1 })
        .populate('restaurant')
        .skip((page - 1) * limit)
        .limit(limit)
      console.log(foods.length)
      return Response.success(res, { foods, foods_amount, pageTotal })
    }
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//trang chủ -10 món mới nhất
exports.getNewFood = async (req, res, next) => {
  try {
    const foods = await Food.find()
      .sort({ dateCreate: -1 })
      .populate('restaurant')
      .skip(0)
      .limit(limitNew)

    if (!foods)
      throw new Error('Có lỗi xảy ra')

    return Response.success(res, { foods })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//top 10 rate
exports.topRate = async (req, res, next) => {
  try {
    let food = await Food.find()
      .sort({ rate: -1, price: 1 })
      .populate('restaurant')
      .skip(0)
      .limit(limit)

    if (!food)
      throw new Error('Có lỗi xảy ra')

    return Response.success(res, { food })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}


//Tìm kiếm món ăn
exports.findProducts = async (req, res, next) => {
  try {
    let {
      key,
      p
    } = req.query

    if (key == undefined || key.trim() == '')
      throw new Error('Có lỗi xảy ra!')

    const page = parseInt(p, 10)
    const productsTotal = await Food.find({ foodName: new RegExp(key, 'i') }).count()
    const pageTotal = Math.ceil(productsTotal / limit)

    if (productsTotal <= 0)
      return Response.error(res, { message: 'Không tìm thấy!' })

    const food = await Food.find({ foodName: new RegExp(key, 'i') })
      .sort({ rate: -1, price: 1, dateCreate: -1 })
      .populate('restaurant')
      .skip((page - 1) * limit)
      .limit(limit);

    return Response.success(
      res, {
      food,
      productsTotal,
      pageTotal
    })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.getMenuByResID = async (req, res, next) => {
  const res_id = req.query.res_id

  try {
    let food = await Food.find({restaurant: res_id})
    if(!food)
      throw new Error('Không có menu.')
      return Response(res, {food})
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

exports.getAllRestaurant = async (req, res, next) => {
  // function Res(_id, isVerified, isLock,
  //   dateGeneral, banner, restaurantName,
  //   email, password, phone, type, address, x, y, __v) {
  //     this._id = _id
  //     this.isVerified = isVerified
  //     this.isLock = isLock
  //     this.dateGeneral = this.dateGeneral
  //     this.banner = banner
  //     this.restaurantName = restaurantName
  //     this.email = email
  //     this.password = password
  //     this.phone = phone
  //     this.type = type
  //     this.address=address
  //     this.x = x 
  //     this.y = y
  //     this.__v = __v
  //    }
  let restaurants = []
  let foods = []
  let restaurant = await Restaurant.find()
  for (let item of restaurant) {
    //let rest = Res(...item)
    //foods = await Food.find({ restaurant: item.restaurant })
    //rest.prototype.foods = foods
    ///console.log(...item)
    restaurants.push(item)
  }
  return Response.success(res, { restaurants })
}


//Xem đánh giá
// foodID  :query
// đếm rate 5,4,3,2,1
// rate trung bình
exports.showRate = async (req, res, next) => {
  const { foodID } = req.query
  try {
    let food = await Food.findById(foodID)
    if (!food)
      throw new Error('Có lỗi xảy ra!')

    const vote_1 = await Star.find({ food: food._id, rate: 1 }).count()
    const vote_2 = await Star.find({ food: food._id, rate: 2 }).count()
    const vote_3 = await Star.find({ food: food._id, rate: 3 }).count()
    const vote_4 = await Star.find({ food: food._id, rate: 4 }).count()
    const vote_5 = await Star.find({ food: food._id, rate: 5 }).count()
    const total = await Star.find({ food: food._id }).count()
    const rate = {
      avg: food.rate,
      total,
      percent_vote_1: Number((vote_1 / total).toFixed(1)),
      percent_vote_2: Number((vote_2 / total).toFixed(1)),
      percent_vote_3: Number((vote_3 / total).toFixed(1)),
      percent_vote_4: Number((vote_4 / total).toFixed(1)),
      percent_vote_5: Number((vote_5 / total).toFixed(1))
    }

    return Response.success(res, { rate })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Xem bình luận
//Hiển thị 5 bình luận
//Ấn next và pre để xem các bình luận cũ hơn hoăc ...
exports.showComment = async (req, res, next) => {
  const { foodID, p } = req.query

  try {
    const page = parseInt(p, 10)
    let food = await Food.findById(foodID)
    if (!food)
      throw new Error('Có lỗi xảy ra!')

    const totalComent = await Comment.find({ food: food._id }).count()
    const totalPage = Math.ceil(totalComent / limit)

    const comment = await Comment.find({ food: food._id })
      .sort({ dateCreate: -1 })
      .populate('user')
      .skip((page - 1) * 5)
      .limit(5)

    return Response.success(res, {
      comment,
      totalComent,
      totalPage
    })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
