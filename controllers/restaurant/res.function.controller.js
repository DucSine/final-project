const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//upload file
const cloudinary = require('../../config/cloudinaryConfig')
//validate
const { validationResult } = require('express-validator')
// Models
const User = require('../../models/User')
const RestaurantType = require('../../models/RestaurantType')
const Restaurant = require('../../models/Restaurant')
const Food = require('../../models/Food')

const Response = require('../../helpers/response.helper')
const limit = 10

exports.resIntroduce = async (req, res) => res.render('./restaurant/introduce')

exports.resHostpage = async (req, res, next) => {
    const restaurant = req.restaurant
    const p = req.query.p
    const  keySearch  = req.query.keySearch 
    const name = req.restaurant.restaurantName.slice(0, 14)
    const resType = await RestaurantType.findById(restaurant.type)

    const page = parseInt(p,10)
    var foodTotal = await Food.find({restaurant: restaurant._id}).count()
    var fPageTotal = Math.ceil(foodTotal / 5)
    var foods = await Food.find({restaurant: restaurant._id,})
        .sort({rate:-1, price: 1 , dateCreate: -1 })
        .skip((page - 1) * 5)
        .limit(5);

    if(keySearch){
        foodTotal = await Food.find({restaurant: restaurant._id,foodName: new RegExp(keySearch,'i')}).count()
        fPageTotal = Math.ceil(foodTotal / limit)
        foods = await Food.find({restaurant: restaurant._id,foodName: new RegExp(keySearch,'i')})
        .sort({rate:-1, price: 1 , dateCreate: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }


    res.render(
        './restaurant/hostpage', 
        { 
            restaurant, 
            name, 
            resType,
            foodTotal,
            fPageTotal,
            foods
        })
}

exports.addFood = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const restaurant = req.restaurant.id
    const {
        file,
        body: {
            foodName,
            price,
            caption,
        }
    } = req

    try {
        let food = await Food.findOne({ foodName })
        if (food)
            throw new Error('Món đã tồn tại.')

        const urlUpload = ''
        if (file) {   // nếu upload ảnh đại diện 
            let orgName = file.originalname || '';
            orgName = orgName.trim().replace(/ /g, '-');
            const fullPathInServ = file.path;
            const newFullPath = `${fullPathInServ}-${orgName}`;
            fs.rename(fullPathInServ, newFullPath);

            const result = await cloudinary.uploader.upload(newFullPath);
            urlUpload = result.url
            fs.unlinkSync(newFullPath);
        }

        await Food.create({
            foodName,
            price,
            image: urlUpload,
            caption,
            restaurant
        })

        return Response.success(res, { mesage: 'Đăng thành công.' })

    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.getFood = async (req,res,next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const restaurant = req.restaurant.id
    const p = req.query.p

    try {
        const page = parseInt(p,10)
        const foodTotal = await Food.find({restaurant}).count()
        const pageTotal = Math.ceil(foodTotal / 5)  //5 is limit
       
        let food = await Food.find({restaurant})
        .sort({rate:-1, price: 1 , dateCreate: -1 })
        .skip((page - 1) * 5)
        .limit(5);
        
        return Response.success(
            res, {
              food,
              foodTotal,
              pageTotal 
            }
        )
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.setBillStatus = async () => {

}

exports.getLoyalCustomers = async () => {

}

exports.createDiscountCode = async () => {

}

exports.senDiscountCode = async () => {

}

exports.report = async () => {
    //Tổng đơn hàng
    //T
}
