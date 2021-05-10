const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs-promise')

//upload file
const cloudinary = require('../../config/cloudinaryConfig')

//validate
const { validationResult } = require('express-validator')
// Models
const User = require('../../models/User')
const RestaurantType = require('../../models/RestaurantType')
const Restaurant = require('../../models/Restaurant')
const Food = require('../../models/Food')
const Bill = require('../../models/Bill')
const Bill_Detail = require('../../models/Bill_Detail')

const Response = require('../../helpers/response.helper')
const limit = 10

exports.resIntroduce = async (req, res) => res.render('./restaurant/introduce')

exports.resHostpage = async (req, res, next) => {
    const restaurant = req.restaurant
    const p = req.query.p
    const keySearch = req.query.keySearch
    const load = req.query.load
    const name = req.restaurant.restaurantName.slice(0, 14)
    const resType = await RestaurantType.findById(restaurant.type)

    const page = parseInt(p, 10)
    var foodTotal = await Food.find({ restaurant: restaurant._id }).count()
    var fPageTotal = Math.ceil(foodTotal / limit)
    var foods = await Food.find({ restaurant: restaurant._id, })
        .sort({ rate: -1, price: 1, dateCreate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

    var curentTransasionTotal = await Bill.find({ status: 'đang xử lý' }).count()
    var curentTransasionPage = Math.ceil(curentTransasionTotal / limit)
    var curentTransasion = await Bill.find({ status: 'đang xử lý' })
        .sort({ dateCreate: -1 })
        .populate('user')
        .skip((page - 1) * limit)
        .limit(limit)

    var confrimTransasionTotal = await Bill.find({ status: 'đã xác nhận' }).count()
    var confrimTransasionPage = Math.ceil(confrimTransasionTotal / limit)
    var confrimTransasion = await Bill.find({ status: 'đã xác nhận' })
        .sort({ dateCreate: -1 })
        .populate('user')
        .skip((page - 1) * limit)
        .limit(limit)

    var doneTransasionTotal = await Bill.find({ status: 'đã thanh toán' }).count()
    var doneTransasionPage = Math.ceil(doneTransasionTotal / limit)
    var doneTransasion = await Bill.find({ status: 'đã thanh toán' })
        .sort({ dateCreate: -1 })
        .populate('user')
        .skip((page - 1) * limit)
        .limit(limit)

    var cancelTransasionTotal = await Bill.find({ status: 'đã hủy' }).count()
    var cancelTransasionPage = Math.ceil(cancelTransasionTotal / limit)
    var cancelTransasion = await Bill.find({ status: 'đã hủy' })
        .sort({ dateCreate: -1 })
        .populate('user')
        .skip((page - 1) * limit)
        .limit(limit)

    //
    var loyalCustomerTotal = await Bill.find({ restaurant: restaurant._id })
        .populate('user')

    var us=[]
    for(var item of loyalCustomerTotal)
        us.push(item.user)
    var usFilter = [...new Set(us)]

    //final
    if (keySearch) {
        switch (load) {
            case 'product':
                foodTotal = await Food.find({ restaurant: restaurant._id, foodName: new RegExp(keySearch, 'i') }).count()
                fPageTotal = Math.ceil(foodTotal / limit)
                foods = await Food.find({ restaurant: restaurant._id, foodName: new RegExp(keySearch, 'i') })
                    .sort({ rate: -1, price: 1, dateCreate: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit);
                break
            case 'bill':
                doneTransasionTotal = await Bill.find({ status: 'đã thanh toán' }).count()
                doneTransasionPage = Math.ceil(doneTransasionTotal / limit)
                doneTransasion = await Bill.find({ status: 'đã thanh toán' })
                    .sort({ dateCreate: -1 })
                    .populate('user')
                    .skip((page - 1) * limit)
                    .limit(limit)

                cancelTransasionTotal = await Bill.find({ _id: new RegExp(keySearch, 'i'), status: 'đã hủy' }).count()
                cancelTransasionPage = Math.ceil(cancelTransasionTotal / limit)
                cancelTransasion = await Bill.find({ _id: new RegExp(keySearch, 'i'), status: 'đã hủy' })
                    .sort({ dateCreate: -1 })
                    .populate('user')
                    .skip((page - 1) * limit)
                    .limit(limit)
                break
            case 'discount':
                break
            default:
                break
        }
    }


    res.render(
        './restaurant/hostpage',
        {
            restaurant,
            name,
            resType,
            foodTotal,
            fPageTotal,
            foods,
            curentTransasionTotal,
            curentTransasionPage,
            curentTransasion,
            confrimTransasionTotal,
            confrimTransasionPage,
            confrimTransasion,
            doneTransasionTotal,
            doneTransasionPage,
            doneTransasion,
            cancelTransasionTotal,
            cancelTransasionPage,
            cancelTransasion,
            //discountcode
            usFilter

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

        if (file) {   // nếu upload ảnh đại diện 
            let orgName = file.originalname || '';
            orgName = orgName.trim().replace(/ /g, '-');
            const fullPathInServ = file.path;
            const newFullPath = `${fullPathInServ}-${orgName}`;
            fs.rename(fullPathInServ, newFullPath);

            const result = await cloudinary.uploader.upload(newFullPath);
            fs.unlinkSync(newFullPath);

            await Food.create({
                foodName,
                price,
                image: result.url,
                caption,
                restaurant
            })
        } else
            throw new Error('Vui lòng post ảnh cho sản phẩm')



        return Response.success(res, { mesage: 'Đăng thành công.' })

    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.editFood = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const restaurant = req.restaurant.id
    const {
        file,
        body: {
            food_id,
            foodName,
            price,
            caption,
        }
    } = req

    try {
        let food = await Food.findById(food_id)
        var rs
        if (!food)
            throw new Error('Có lỗi xảy ra.')

        if (file) {   // nếu upload ảnh đại diện 
            let orgName = file.originalname || '';
            orgName = orgName.trim().replace(/ /g, '-');
            const fullPathInServ = file.path;
            const newFullPath = `${fullPathInServ}-${orgName}`;
            fs.rename(fullPathInServ, newFullPath);

            const result = await cloudinary.uploader.upload(newFullPath);
            fs.unlinkSync(newFullPath)
            rs = await Food.findByIdAndUpdate(
                food._id,
                {
                    $set:
                    {
                        foodName,
                        price,
                        caption,
                        image: result.url
                    }
                }
            )
        }
        else
            rs = await Food.findByIdAndUpdate(
                food._id,
                {
                    $set:
                    {
                        foodName,
                        price,
                        caption
                    }
                }
            )

        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { message: 'Cập nhật thành công.' })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.delFood = async (req, res, next) => {
    const food_id = req.query.foodId
    try {
        let food = await Food.findByIdAndDelete(food_id)
        if (!food)
            throw new Error('Có lỗi xảy ra')

        return Response.success(res, { message: 'Cập nhật thành công.' })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.getFood = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const foodID = req.query.food_id

    try {
        let food = await Food.findById(foodID)
        if (!food)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { food })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.getBillDetail = async (req, res, next) => {
    const bill_id = req.query.bill_id
    try {
        let bill = await Bill.findById(bill_id)
            .populate('user')
            .populate('discount_code')
        if (!bill)
            throw new Error('Bill không tồn tại.')

        const bill_detail = await Bill_Detail.find({ bill: bill_id })
            .populate('food')

        return Response.success(res, { bill, bill_detail })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.confirmBill = async (req, res, next) => {
    const bill_ID = req.query.billId
    try {
        const bill = await Bill.findById(bill_ID)
        if (!bill)
            throw new Error('Có lỗi xảy ra.')
        var rs = await Bill.findByIdAndUpdate(bill_ID, { $set: { status: 'đã xác nhận' } })

        return Response.success(res, { mesage: 'Cập nhật thành công.' })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.cancelBill = async (req, res, next) => {
    const {
        bill_id,
        message
    } = req.body
    console.log(req.body)

    try {
        let bill = await Bill.findById(bill_id)
        if (!bill)
            throw new Error('Đơn hàng không tồn tại.')

        const rs = await Bill.findByIdAndUpdate(bill_id, { $set: { status: 'đã hủy', message } })
        return Response.success(res, { mesage: 'Đơn hàng đã hủy.' })
    } catch (error) {
        console.log(error)
        return next(error)
    }


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

