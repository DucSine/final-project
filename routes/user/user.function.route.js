const express = require('express')
const multer = require('multer')
const router = express.Router()

const { 
    rate,
    editRate,
    addCart,
    updateCart,
    showCart,
    comment
} = require('../../controllers/user/user.function.controller')

// @route   POST api/user/func/addcart
// @desc    Thêm vào giỏ hàng
// @access  Private
router.post('/addCart', addCart)

// @route   POST api/user/func/updateCart
// @desc    Cập nhật giỏ hàng
// @access  Private
router.post('/updateCart', updateCart)

// @route   GET api/user/func/cart
// @desc    Xem giỏ hàng
// @access  Private
router.post('/cart', showCart)

// @route   POST api/user/func/rate
// @desc    Đánh giá
// @access  Private
router.post('/rate', rate)

// @route   POST api/user/func/editRate
// @desc    Đánh giá
// @access  Private
router.post('/editRate', editRate)

// @route   POST api/user/func/comment
// @desc    Bình luận
// @access  Private
router.post('/comment', comment)

//còn thiếu: add giỏ hàng,mua hàng, thanh toán
module.exports = router;
