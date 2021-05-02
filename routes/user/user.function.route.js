const express = require('express')
const multer = require('multer')
const router = express.Router()

const {
    rate,
    editRate,
    addCart,
    updateCart,
    showCart,
    comment,
    createBill,
    addFoodToBill,
    showBillDetail,
    cancelOrder,
    privateDiscountCode,
    publicDiscountCode,
    getHistoryTransaction
} = require('../../controllers/user/user.function.controller')
const { protect } = require('../../middlewares/user/auth')

// @route   POST api/user/func/addcart
// @desc    Thêm vào giỏ hàng
// @access  Private
router.post('/addCart', protect, addCart)

// @route   POST api/user/func/updateCart
// @desc    Cập nhật giỏ hàng
// @access  Private
router.post('/updateCart', protect, updateCart)

// @route   GET api/user/func/cart
// @desc    Xem giỏ hàng
// @access  Private
router.post('/cart', protect, showCart)

// @route   POST api/user/func/createBill
// @desc    Tạo đơn hàng
// @access  Private
router.post('/createBill', protect, createBill)

// @route   POST api/user/func/addProductToBill
// @desc    Thêm sản phẩm vào đơn hàng
// @access  Private
router.post('/addProductToBill', protect, addFoodToBill)

// @route   GET api/user/func/billDetail
// @desc    Xem chi tiết đơn hàng
// @access  Private
router.post('/billDetail', protect, showBillDetail)

// @route   POST api/user/func/billCancel
// @desc    Hủy đơn hàng
// @access  Private
router.post('/billCancel', protect, cancelOrder)

// @route   GET api/user/func/transecsion
// @desc    Lịch sử giao dịch
// @access  Private
router.post('/transecsion', protect, getHistoryTransaction)

// @route   POST api/user/func/rate
// @desc    Đánh giá
// @access  Private
router.post('/rate', protect, rate)

// @route   POST api/user/func/editRate
// @desc    Đánh giá
// @access  Private
router.post('/editRate', protect, editRate)

// @route   POST api/user/func/comment
// @desc    Bình luận
// @access  Private
router.post('/comment', protect, comment)

// @route   GET api/user/func/publicDiscount
// @desc    Mã giảm giá chung
// @access  Private
router.post('/publicDiscount', protect, publicDiscountCode)

// @route   GET api/user/func/privateDiscount
// @desc    Mã giảm giá riêng
// @access  Private
router.post('/privateDiscount', protect, privateDiscountCode)

module.exports = router;
