const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs-promise')

//upload file
const cloudinary = require('../../config/cloudinaryConfig')
const { io } = require('../../helpers/handleSocketIo.helper')
//validate
const { validationResult } = require('express-validator')
// Models
const User = require('../../models/User')
const RestaurantType = require('../../models/RestaurantType')
const Food = require('../../models/Food')
const Bill = require('../../models/Bill')
const Bill_Detail = require('../../models/Bill_Detail')
const Discount_code = require('../../models/Discount_code')
const Messages = require('../../models/Messages')

const Response = require('../../helpers/response.helper')
const Loyal_user = require('../../models/Loyal_user')
const f_limit = 10
const b_limit = 8

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
    var fPageTotal = Math.ceil(foodTotal / f_limit)
    var foods = await Food.find({ restaurant: restaurant._id, })
        .sort({ rate: -1, price: 1, dateCreate: -1 })
        .skip((page - 1) * f_limit)
        .limit(f_limit)

    var curentTransasionTotal = await Bill.find({ restaurant: restaurant._id, status: 'đang xử lý' }).count()
    var curentTransasionPage = Math.ceil(curentTransasionTotal / b_limit)
    var curentTransasion = await Bill.find({ restaurant: restaurant._id, status: 'đang xử lý' })
        .sort({ _id: 1 })
        .populate('user')
        .skip((page - 1) * b_limit)
        .limit(b_limit)

    var confrimTransasionTotal = await Bill.find({ restaurant: restaurant._id, status: 'đã xác nhận' }).count()
    var confrimTransasionPage = Math.ceil(confrimTransasionTotal / b_limit)
    var confrimTransasion = await Bill.find({ restaurant: restaurant._id, status: 'đã xác nhận' })
        .sort({ _id: 1 })
        .populate('user')
        .skip((page - 1) * b_limit)
        .limit(b_limit)

    let payTransasionTotal  = await Bill.find({ restaurant: restaurant._id, status: 'đã thanh toán' }).count()
    let payTransasionPage = Math.ceil(confrimTransasionTotal / b_limit)
    var payTransasion = await Bill.find({ restaurant: restaurant._id, status: 'đã thanh toán' })
        .sort({ _id: 1 })
        .populate('user')
        .skip((page - 1) * b_limit)
        .limit(b_limit)

    var doneTransasionTotal = await Bill.find({ restaurant: restaurant._id, status: 'đã hoàn tất' }).count()
    var doneTransasionPage = Math.ceil(doneTransasionTotal / b_limit)
    var doneTransasion = await Bill.find({ restaurant: restaurant._id, status: 'đã hoàn tất' })
        .sort({ _id: 1 })
        .populate('user')
        .skip((page - 1) * b_limit)
        .limit(b_limit)

    var cancelTransasionTotal = await Bill.find({ restaurant: restaurant._id, status: 'đã hủy' }).count()
    var cancelTransasionPage = Math.ceil(cancelTransasionTotal / b_limit)
    var cancelTransasion = await Bill.find({ restaurant: restaurant._id, status: 'đã hủy' })
        .sort({ _id: 1 })
        .populate('user')
        .skip((page - 1) * b_limit)
        .limit(b_limit)

    //
    var loyal_user = await Loyal_user.find({ restaurant: restaurant._id })
        .sort({ point: -1 })
        .populate('user')

    var discount_code = await Discount_code.find({ restaurant: restaurant._id })
    var code = []
    var expired_code = []
    for (let item of discount_code) {
        if ((Number(item.dateExprite) <= Date.now()) || item.amount == 0)
            expired_code.push(item)
        else
            code.push(item)
    }
    //final
    if (keySearch) {
        switch (load) {
            case 'product':
                foodTotal = await Food.find({ restaurant: restaurant._id, foodName: new RegExp(keySearch, 'i') }).count()
                fPageTotal = Math.ceil(foodTotal / f_limit)
                foods = await Food.find({ restaurant: restaurant._id, foodName: new RegExp(keySearch, 'i') })
                    .sort({ rate: -1, price: 1, dateCreate: -1 })
                    .skip((page - 1) * f_limit)
                    .limit(f_limit);
                break
            case 'bill':
                doneTransasionTotal = await Bill.find({ status: 'đã thanh toán' }).count()
                doneTransasionPage = Math.ceil(doneTransasionTotal / f_limit)
                doneTransasion = await Bill.find({ status: 'đã thanh toán' })
                    .sort({ dateCreate: -1 })
                    .populate('user')
                    .skip((page - 1) * f_limit)
                    .limit(f_limit)

                cancelTransasionTotal = await Bill.find({ _id: new RegExp(keySearch, 'i'), status: 'đã hủy' }).count()
                cancelTransasionPage = Math.ceil(cancelTransasionTotal / f_limit)
                cancelTransasion = await Bill.find({ _id: new RegExp(keySearch, 'i'), status: 'đã hủy' })
                    .sort({ dateCreate: -1 })
                    .populate('user')
                    .skip((page - 1) * f_limit)
                    .limit(f_limit)
                break
            case 'discount':
                break
            default:
                break
        }
    }
    let notifications = await Bill.find({ restaurant: restaurant._id })
        .sort({ sort: -1 })
        .skip((page - 1) * f_limit)
        .limit(f_limit)

    res.render(
        './restaurant/hostpage',
        {
            restaurant,             //res
            name,
            resType,
            foodTotal,              //food
            fPageTotal,
            foods,
            curentTransasionTotal,  //transacsion
            curentTransasionPage,
            curentTransasion,
            confrimTransasionTotal,
            confrimTransasionPage,
            confrimTransasion,
            doneTransasionTotal,
            doneTransasionPage,
            doneTransasion,
            payTransasion,

            cancelTransasionTotal,
            cancelTransasionPage,
            cancelTransasion,
            loyal_user,            //discountcode
            notifications,
            code,
            expired_code,
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

        const discount_id = bill.discount_code
        var resPay = 0
        if (discount_id != null) {
            var discount = await Discount_code.findById(discount_id)
            if (discount.restaurant == req.restaurant.id) {
                var afterUseCode = bill.total - (bill.total * discount.discount) / 100
                resPay = afterUseCode - (afterUseCode * 10) / 100
            } else
                resPay = bill.total - (bill.total * 10) / 100
        }
        else
            resPay = bill.total - (bill.total * 10) / 100

        if (!bill)
            throw new Error('Bill không tồn tại.')

        const bill_detail = await Bill_Detail.find({ bill: bill_id })
            .populate('food')

        return Response.success(res, { bill, bill_detail, resPay })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.confirmBill = async (req, res, next) => {
    const bill_ID = req.query.billId
    const restaurant = req.restaurant.id
    try {
        const bill = await Bill.findById(bill_ID)
        if (!bill)
            throw new Error('Có lỗi xảy ra.')

        let rs
        if (bill.payment)
            rs = await Bill.findByIdAndUpdate(bill_ID, { $set: { status: 'đã thanh toán' } })
        else
            rs = await Bill.findByIdAndUpdate(bill_ID, { $set: { status: 'đã xác nhận' } })
        
        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        var bill_detail = await Bill_Detail.find({ bill: rs._id })
        for (var item of bill_detail) {
            var food = await Food.findById(item.food)
            rs = await Food.findByIdAndUpdate(food._id, { $set: { buys: food.buys + item.amount } })
            if (!rs)
                throw new Error('Có lỗi xảy ra.')
        }

        //Điểm tich lũy
        const loyal_user = await Loyal_user.findOne({ restaurant, user: bill.user })
        if (loyal_user) {
            var point = loyal_user.point + Math.ceil(bill.total / 1000)
            rs = await Loyal_user.findByIdAndUpdate(loyal_user._id, { $set: { point } })
        }
        else {
            var point = Math.ceil(bill.total / 1000)
            rs = await Loyal_user.create({
                restaurant,
                user: bill.user,
                point
            })
        }

        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        const message_io = `Đơn hàng: ${bill._id} Đã được xác nhận.`

        const sortMessages = await Messages.find().count()
        rs = await Messages.create({
            object: bill.user,
            title: 'billMessage',
            message: message_io,
            sort: sortMessages - 1
        })
        if (!rs)
            throw new Error('Có lỗi xảy ra.')
        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        io.to(bill.user.toString()).emit('billMessage', message_io)

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

exports.createPublicDiscount = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const restaurant = req.restaurant.id
    const {
        discount,
        code,
        amount,
        dateExprite, //number
        user
    } = req.body

    try {
        const currentDiscount = await Discount_code.findOne({ code })
        if (currentDiscount)
            if (Number(currentDiscount.dateExprite) >= Date.now())
                throw new Error('Mã đã tồn tại hoặc đang còn hiệu lực.')

        if (amount.indexOf('.') != -1 || amount.indexOf(',') != -1 || amount.indexOf('e') != -1)
            throw new Error('Số lượng mã không hợp lệ')

        if (Number(amount) <= 0)
            throw new Error('Số lượng mã không hợp lệ')

        if (Number(dateExprite) <= Date.now())
            throw new Error('Thời gian hết hạn không hợp lệ.')

        let rs = await Discount_code.create({
            discount,
            code,
            amount,
            dateExprite: new Date(Number(dateExprite)),
            user,
            restaurant
        })

        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { message: 'Tạo mã thành công' })

    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.createPrivateDiscount = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const restaurant = req.restaurant.id
    const {
        discount,
        code,
        dateExprite, //number
        user
    } = req.body
    try {
        const currentDiscount = await Discount_code.findOne({ code })
        if (currentDiscount)
            if (Number(currentDiscount.dateExprite) >= Date.now())
                throw new Error('Mã đã tồn tại hoặc đang còn hiệu lực.')
        if (Number(dateExprite) <= Date.now())
            throw new Error('Thời gian hết hạn không hợp lệ.')

        let rs = await Discount_code.create({
            discount,
            code,
            user,
            dateExprite: new Date(Number(dateExprite)),
            restaurant
        })

        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { message: 'Đã gửi mã đến khách hàng.' })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.getLoyalUserDetail = async (req, res, next) => {
    const user_ID = req.query.user_id

    try {
        let loyal_user = await Loyal_user.findOne({ user: user_ID })
            .populate('user')
        if (!loyal_user)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { loyal_user })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.getDiscountById = async (req, res, next) => {
    const discount_id = req.query.discount_id
    try {
        let discount = await Discount_code.findById(discount_id)
            .populate('user')
        if (!discount)
            throw new Error('Có lỗi xảy ra.')
        return Response.success(res, { discount })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.getLoyalUserHisTrans = async (req, res, next) => {
    const user_ID = req.query.user_id
    const res_ID = req.restaurant.id

    try {
        let hisTrans = await Bill.find({ restaurant: res_ID, user: user_ID })
        if (!hisTrans)
            throw new Error('Có lỗi xảy ra.')
        return Response.success(res, { hisTrans })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.getDataReport = async (req, res, next) => {
    const restaurant = req.restaurant.id
    try {
        //chart
        let report_bill_wait = await Bill.find({ restaurant, status: 'đang xử lý' }).count()
        let report_bill_confirm = await Bill.find({ restaurant, status: 'đã xác nhận' }).count()
        let report_bill_cancel = await Bill.find({ restaurant, status: 'đã hủy' }).count()
        let report_bill_pay = await Bill.find({ restaurant, status: 'đã thanh toán' }).count()
        let report_bill_done = await Bill.find({ restaurant, status: 'đã hoàn tất' }).count()
        let bill = [report_bill_done, report_bill_confirm, report_bill_pay, report_bill_wait, report_bill_cancel]

        // revenue total
        let revenue = 0
        let bills_amount = await Bill.find({ restaurant }).count()

        let bills = await Bill.find({ restaurant, status: 'đã hoàn tất' })
        for (let item of bills)
            revenue += item.total

        // customer
        let customer_total = await Loyal_user.find({ restaurant }).count()
        let new_customer_total = await Loyal_user.find({ restaurant }).count()

        //rate: product
        let foods = await Food.find({ restaurant })
        let rate_hight = 0
        let rate_medium = 0
        let rate_low = 0

        for (let food of foods) {
            if (food.rate > 4)
                rate_hight++
            else if (food.rate > 3)
                rate_medium++
            else
                rate_low++
        }

        return Response.success(res, { bill, bills_amount, revenue, customer_total, rate_hight, rate_medium, rate_low })
    } catch (error) {
        console.log(error)
        return next(error)
    }

}