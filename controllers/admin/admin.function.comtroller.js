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
const Discount_code = require('../../models/Discount_code')

const Response = require('../../helpers/response.helper')
const limit = 15


exports.adminLogin = async (req, res, next) => {
    res.render('./admin/login')
}

exports.adminHostPage = async (req, res, next) => {
    res.render('./admin/hostpage')
}

exports.getRestaurant = async (req, res, next) => {
    const { type, p } = req.query

    try {
        const page = parseInt(p, 10)
        let total = 0
        let pageTotal = 0
        let restaurant

        if (!type) {
            total = await Restaurant.find().count()
            restaurant = await Restaurant.find()
                .populate('type')
                .skip((page - 1) * limit)
                .limit(limit)
        }
        else {
            total = await Restaurant.find({ type }).count()
            restaurant = await Restaurant.find({ type })
                .skip((page - 1) * limit)
                .limit(limit)
        }

        if (!restaurant)
            throw new Error('Có lỗi xảy ra.')
        pageTotal = Math.ceil(total / limit)

        return Response.success(res, { restaurant, total, pageTotal })
    } catch (error) {
        console.log(error)
        return next(new Error('Có lỗi xảy ra!'))
    }
}

exports.getRestaurantById = async (req, res, next) => {
    const resId = req.query.resId
    try {
        let restaurant = await Restaurant.findById(resId).populate('type')
        if (!restaurant)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { restaurant })
    } catch (error) {
        console.log(error)
        return next(new Error('Có lỗi xảy ra!'))
    }
}

exports.getRestaurantType = async (req, res, next) => {
    try {
        let tpye = await RestaurantType.find()
        if (!tpye)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { type })
    } catch (error) {
        console.log(error)
        return next(new Error('Có lỗi xảy ra!'))
    }
}

exports.flagLockRestaurant = async (req, res, next) => {
    const {
        resId,
        isLock
    } = req.body

    try {
        let restaurant = await Restaurant.findById(resId)
        if (!restaurant)
            throw new Error('Có lỗi xảy ra.')

        let rs = await Restaurant.findByIdAndUpdate(restaurant._id, { $set: { isLock } })
        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { message: 'Cập nhật thành công.' })
    } catch (error) {
        console.log(error)
        return next(new Error('Có lỗi xảy ra!'))
    }
}

exports.getUser = async (req, res, next) => {
    const { fullName, p } = req.query

    try {
        const page = parseInt(p, 10)
        let total = 0
        let pageTotal = 0
        let users

        if (!fullName) {
            total = await User.find().count()
            users = await User.find()
                .skip((page - 1) * limit)
                .limit(limit)
        }
        else {
            total = await User.find({ fullName }).count()
            users = await User.find({ fullName })
                .skip((page - 1) * limit)
                .limit(limit)
        }

        if (!users)
            throw new Error('Có lỗi xảy ra.')

        pageTotal = Math.ceil(total / limit)

        return Response.success(res, { users, total, pageTotal })
    } catch (error) {
        console.log(error)
        return next(new Error('Có lỗi xảy ra!'))
    }


}

exports.getUserById = async (req, res, next) => {
    const userId = req.query.userId
    try {
        let user = await User.findById(userId)
        if (!user)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { user })
    } catch (error) {
        console.log(error)
        return next(new Error('Có lỗi xảy ra!'))
    }
}

exports.flagLockUser = async (req, res, next) => {
    const {
        userId,
        isLock
    } = req.body

    try {
        let users = await User.findById(userId)
        if (!users)
            throw new Error('Có lỗi xảy ra.')

        let rs = await User.findByIdAndUpdate(userId, { $set: { isLock } })
        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { message: 'Cập nhật thành công.' })
    } catch (error) {
        console.log(error)
        return next(new Error('Có lỗi xảy ra!'))
    }
}


exports.getDiscount = async (req, res, next) => {
    const { code, p } = req.query

    try {
        const page = parseInt(p, 10)
        let total = 0
        let pageTotal = 0
        let discount

        if (!code) {
            total = await Discount_code.find({ restaurant: null }).count()
            discount = await Discount_code.find({ restaurant: null })
                .sort({ dateExprite: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
        }
        else {
            total = await Discount_code.find({ code, restaurant: null }).count()
            discount = await Discount_code.find({ code, restaurant: null })
                .sort({ dateExprite: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
        }

        if (!discount)
            throw new Error('Có lỗi xảy ra.')

        pageTotal = Math.ceil(total / limit)

        return Response.success(res, { discount, total, pageTotal })
    } catch (error) {
        console.log(error)
        return next(new Error('Có lỗi xảy ra!'))
    }

}

exports.createDiscount = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })
    const {
        discount,
        code,
        amount,
        dateExprite, //number
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
        })

        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(res, { message: 'Tạo mã thành công' })

    } catch (error) {
        console.log(error)
        return next(error)
    }
}

exports.editDiscount = async (req, res, next) => { }