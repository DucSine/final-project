const express = require('express')

const router = express.Router()

const {
    getNewFood, 
    topRate, 
    findProducts,
    showRate,
    showComment
} = require('../../controllers/user/cus.function.controller')

// @route   GET api/user/cus/getNewFood
// @desc    Lấy 5 món mới
// @access  Public
router.get('/getNewFood', getNewFood)

// @route   GET api/user/cus/rate
// @desc    Lấy top 10 món
// @access  Public
router.get('/', topRate)

// @route   GET api/user/cus/findProducts
// @desc    Tìm kiếm 
// @access  Public
router.get('/findProducts', findProducts)

// @route   GET api/user/cus/showRate
// @desc    Xem danh sách đánh giá
// @access  Public
router.get('/findProducts', showRate)

// @route   GET api/user/cus/showComment
// @desc    Xem danh sách bình luận
// @access  Public
router.get('/findProducts', showComment)

module.exports = router