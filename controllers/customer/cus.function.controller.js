const Food = require('../../models/Food')
const Response = require('../../helpers/response.helper')
const Star = require('../../models/Star')
const Comment = require('../../models/Comment')
const Restaurant = require('../../models/Restaurant')
const limit = 20

//trang chủ -5 món mới nhất
exports.getNewFood = async(req, res, next)=>{
  try{
    const foods = await Food.find()
      .sort({ dateCreate: -1 })
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
    /*const food = await Food.find()
      .sort({ rate: -1, price: 1, dateCreate: -1 })
      .skip(0)
      .limit(10)
  
    if (!food) 
      throw new Error('Có lỗi xảy ra')
  */
    food = await Food.find()
      .sort({ price: 1, dateCreate: -1 })
      .skip(0)
      .limit(10)
  

    return Response.success( res, { food })
  } catch (error) {
    console.log(error)
    return next(error)
  }
}
  
//Tìm kiếm món ăn
exports.findProducts = async(req, res, next)=>{
  try{
    let {
      key, 
      p 
    } = req.query
    console.log(typeof key)

    if(key == undefined || key.trim() == '')
      throw new Error('Có lỗi xảy ra!')

    const page = parseInt(p,10)
    const productsTotal = await Food.find({foodName: new RegExp(key,'i')}).count()
    const pageTotal = Math.ceil(productsTotal / limit)
  
    if(productsTotal <= 0)
      return Response.error(res,{message: 'Không tìm thấy!'})
  
    const food = await Food.find({foodName: new RegExp(key,'i')})
      .sort({rate:-1, price: 1 , dateCreate: -1 })
      .skip((page - 1) * limit)
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

// Lấy thông tin nhà hàng
exports.getRestaurantInfo = async(req, res, next)=>{
  const { resID } = req.query
  
  try {
    let restaurant = await Restaurant.findById(resID)
      .populate('type')
      
    if(!restaurant)
      throw new Error('Nhà hàng không tồn tại!')

    return Response.success(res, {restaurant})
  } catch (error) {
    console.log(error)
    return next(error)
  }
}

//Xem đánh giá
// foodID  :query
// đếm rate 5,4,3,2,1
// rate trung bình
exports.showRate = async(req, res, next)=>{
  const { foodID } = req.query
  try{
    let food = await Food.findById(foodID)
    if(!food)
      throw new Error('Có lỗi xảy ra!')
      
    const vote_1 = await Star.find({ food: food._id, rate: 1 }).count()
    const vote_2 = await Star.find({ food: food._id, rate: 2 }).count()
    const vote_3 = await Star.find({ food: food._id, rate: 3 }).count()      
    const vote_4 = await Star.find({ food: food._id, rate: 4 }).count()
    const vote_5 = await Star.find({ food: food._id, rate: 5 }).count()
    const rate = {
      avg: food.rate,
      vote_1,
      vote_2,
      vote_3,
      vote_4,
      vote_5
    }
  
  return Response.success(res, {rate})
  }catch(error){
    console.log(error)
    return next(error)
  }
}

//Xem bình luận
//Hiển thị 5 bình luận
//Ấn next và pre để xem các bình luận cũ hơn hoăc ...
exports.showComment = async(req, res, next)=>{
  const { foodID, p } = req.query 
  
  try{
    const page = parseInt(p,10)
    let food = await Food.findById(foodID)
    if(!food)
      throw new Error('Có lỗi xảy ra!')

    const totalComent = await Comment.find({food: food._id}).count()
    const totalPage = Math.ceil(totalComent / limit)
    
    const comment = await Comment.find({food: food._id})
      .sort({dateCreate: -1})
      .populate('user')
      .skip((page - 1) * 5)
      .limit(5)

    return Response.success(res,{
      comment, 
      totalComent, 
      totalPage
    })
  }catch(error){
    console.log(error)
    return next(error)
  } 
}
