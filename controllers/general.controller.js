const bcrypt = require('bcryptjs')

const Response = require('../helpers/response.helper')
const { io } = require('../helpers/handleSocketIo.helper')

const {
    emailIsExists,
    decodeAuthToken
} = require('../config/general')
const Restaurant = require('../models/Restaurant')
const Bill = require('../models/Bill')
const Messages = require('../models/Messages')

exports.checkEmail = async (req, res, next) => {
    const email = req.query.email
    if (!await (emailIsExists(email)))
        Response.success(res, { message: 'true' })
    Response.error(res, { message: 'false' })
}

exports.resAuthToken = async (req, res, next) => {
    const tokenAuth = req.query.tokenAuth
    try {
        const decode = decodeAuthToken(tokenAuth)
        if (!decode) {
            res.send("<script>alert('Link đã hết hạn.')</script>")
            return false
        }
        await Restaurant.findByIdAndUpdate(decode.restaurant.id, { $set: { isVerified: true } })
        res.send("<script>alert('Tài khoản đã được kích hoạt thành công.')</script>; window.location = '/'")
        return true

    } catch (error) {
        console.log(error.message)
        return next(error)
    }
}

exports.resetPage = async (req, res, next) => {
    const token = req.query.token
    try {
        const decode = decodeAuthToken(token)
        if (decode.admin || decode.restaurant.id)
            res.render('./layouts/reset')
        else
            throw new Error('Lỗi quyền truy cập')
    } catch (error) {
        console.log(error.message)
        return next(error())
    }


}

exports.resetPass = async (req, res, next) => {
    const token = req.query.token
    const { password } = req.body
    console.log(req.body)
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt)
        const decode = decodeAuthToken(token)
        console.log(decode.restaurant.id)
        var object = ''
        if (decode.admin) {
            process.ADMIN_PASSWORD = hashPass
            object = 'admin'
        }
        else {
            console.log('day')
            const resID = decode.restaurant.id
            const rs = await Restaurant.findByIdAndUpdate(resID, { $set: { password: hashPass } })
            if (rs)
                object = 'res'
        }

        res.cookie('token', token)
        return Response.success(res,
            {
                message: 'Cập nhật thành công',
                object
            })
    } catch (error) {
        console.log(error.message)
        return next(error)
    }
}

exports.billComplete = async (req, res, next) => {
    const bill_id = req.query.bill_id

    try {
        let bill = await Bill.findById(bill_id)
        if (!bill)
            throw new Error('Đơn hàng không tồn tại.')

        if (bill.status != 'đã xác nhận')
            throw new Error('Đơn hàng không tồn tại.')

        const rs = await Bill.findByIdAndUpdate(bill_id, { $set: { status: 'đã thanh toán' } })
        if (!rs)
            throw new Error('Có lỗi xảy ra.')

        const message_io = {
            restaurant: `Đơn hàng ${bill._id} đã được giao đến khách hàng.`,
            user: `Đơn hàng ${bill._id} đã được giao đến bạn, vui lòng dành chút thời gian đánh giá chất lượng sản phẩm.`
        }

        const totalMessage = Messages.find().count()
        let rs_message = await Messages.create({
            object: bill.restaurant,
            title: 'billMessage',
            message: message_io.restaurant,
            sort: totalMessage - 1
        })
        if (!rs_message)
            throw new Error('Có lỗi xảy ra.')

        rs_message = await Messages.create({
            object: bill.user,
            title: 'billMessage',
            message: message_io.user,
            sort: totalMessage
        })
        if (!rs_message)
            throw new Error('Có lỗi xảy ra.')

        io.to(bill.restaurant.toString()).emit('billMessage', message_io.restaurant)
        io.to(bill.user.toString()).emit('billMessage', message_io.user)
        
        return Response.success(res, { message: 'Cập nhật thành công.' })
    } catch (error) {
        console.log(error.message)
        return next(error)
    }
}