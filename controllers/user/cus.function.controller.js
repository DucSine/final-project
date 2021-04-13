const fs = require('fs-promise')

const cloudinary = require('../../config/cloudinaryConfig')
const Food = require('../../models/Food')
const Response = require('../../helpers/response.helper')
const limit = 20

//trang chủ -5 món mới nhất
exports.getNewFood = async(req, res, next)=>{
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
    let {
      key, 
      p 
    } = req.query
    const page = parseInt(p,10)
    const productsTotal = await Food.find({foodName: new RegExp(key,'i')}).count()
    const pageTotal = Math.ceil(productsTotal / limit)
  
    if(productsTotal<=0)
      return Response.error(res,{message: 'Không tìm thấy!'})
  
    const food = await Food.find({foodName: new RegExp(key,'i')})
      .sort({rate:-1, price: 1 , dateCreate: -1 })
      .populate('restaurant')
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

//Xem đánh giá
exports.showRate = async(req, res, next)=>{
// foodID  :query
}

//Xem bình luận
exports.showComment = async(req, res, next)=>{

}
