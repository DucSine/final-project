const express = require('express')
const multer = require('multer')

const router = express.Router()
const upload = multer({ dest: './resources/uploads' })
const { check } = require('express-validator')

const {
    getRestaurant, 
    flagLockRestaurant, 
    flagLockUser,
    getUser,
    getDiscount,
    createDiscount,
    editDiscount,
    getRestaurantType,
} = require('../../controllers/admin/admin.function.comtroller')

// @route   GET /api/admin/func/getRestaurant
// @desc    Lấy danh sách nhà hàng
// @access  Private
router.get('/getRestaurant', getRestaurant)

// @route   GET /api/admin/func/getRestaurantType
// @desc    Lấy danh sách nhà hàng
// @access  Private
router.get('/getRestaurantType', getRestaurantType)

// @route   POST /api/admin/func/flagLockRestaurant
// @desc    Khóa, mở khóa tài khoản nhà hàng
// @access  Private
router.post('/flagLockRestaurant', flagLockRestaurant)

// @route   GET /api/admin/func/getUser
// @desc    Lấy danh sách khách hàng
// @access  Private
router.get('/getUser', getUser)

// @route   POST /api/admin/func/flagLockUser
// @desc    Khóa, mở khóa tài khoản khách hàng
// @access  Private
router.post('/flagLockUser', flagLockUser)

// @route   GET /api/admin/func/getDiscount
// @desc    Lấy danh sách mã giảm giá của admin
// @access  Private
router.get('/getDiscount', getDiscount)

// @route   POST /api/admin/func/createDiscount
// @desc    Tạo mã giảm giá
// @access  Private
router.post('/createDiscount', createDiscount)

// @route   POST /api/admin/func/editDiscount
// @desc    Tạo mã giảm giá
// @access  Private
router.post('/editDiscount', editDiscount)


module.exports = router;