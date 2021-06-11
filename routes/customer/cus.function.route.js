const express = require('express')

const router = express.Router()

const {
    getNewFood, 
    topRate, 
    findProducts,
    showRate,
    showComment,
    getRestaurantInfo,
    getNameProducts,
    getAllFood,
} = require('../../controllers/customer/cus.function.controller')

// @route   GET api/cus/getAllProduct
// @desc    Lấy toàn bộ tên món ăn, param: p= 1,2,...
// @access  Public
router.get('/getAllProduct', getAllFood)
// @route   GET api/cus/getNameProducts
// @desc    Lấy toàn bộ tên món ăn
// @access  Public
router.get('/getNameProducts', getNameProducts)

// @route   GET api/cus/getNewFood
// @desc    Lấy 5 món mới
// @access  Public
router.get('/getNewFood', getNewFood)

// @route   GET api/cus/topRate
// @desc    Lấy top 10 món
// @access  Public
router.get('/topRate', topRate)

// @route   GET api/cus/findProducts
// @desc    Tìm kiếm 
// @access  Public
router.get('/findProducts', findProducts)

// @route   GET api/cus/getRestaurantInfo
// @desc    Lấy thông tin nhà hàng
// @access  Public
router.get('/getRestaurantInfo', getRestaurantInfo)


// @route   GET api/cus/showRate
// @desc    Xem đánh giá
// @access  Public
router.get('/showRate', showRate)

// @route   GET api/cus/showComment
// @desc    Xem danh sách bình luận
// @access  Public
router.get('/showComment', showComment)

module.exports = router