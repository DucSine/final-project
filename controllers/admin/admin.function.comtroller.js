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
const limit = 20


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

exports.flagLockRestaurant = async (req, res, next) => {
    const {
        res_id,
        isLock
    } = req.body

    try {
        let restaurant = await Restaurant.findById(res_id)
        if (!restaurant)
            throw new Error('Có lỗi xảy ra.')

        let rs = await Restaurant.findByIdAndUpdate(res_id, { $set: { isLock } })
        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(req, { message: 'Cập nhật thành công.' })
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

        if (!type) {
            total = await User.find().count()
            users = await User.find()
                .populate('type')
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

exports.flagLockUser = async (req, res, next) => {
    const {
        user_id,
        isLock
    } = req.body

    try {
        let users = await User.findById(user_id)
        if (!users)
            throw new Error('Có lỗi xảy ra.')

        let rs = await User.findByIdAndUpdate(user_id, { $set: { isLock } })
        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        return Response.success(req, { message: 'Cập nhật thành công.' })
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

        if (!type) {
            total = await Discount_code.find({ restaurant: null }).count()
            discount = await Discount_code.find({ restaurant: null })
                .populate('type')
                .skip((page - 1) * limit)
                .limit(limit)
        }
        else {
            total = await Discount_code.find({ code, restaurant: null }).count()
            discount = await Discount_code.find({ code, restaurant: null })
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

exports.createDiscount = (req, res, next) => {
    const {
        amount,
        code,
        discount,
        dateExprite // numbers
    } = req.body

}

exports.editDiscount = (req, res, next) => { }