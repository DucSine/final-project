const express = require('express');

const router = express.Router();
const { protect } = require('../../middlewares/user/auth')

const { 
    getNewFood, 
    topRate, 
    findProducts, 
    rate, 
    comment
} = require('../../controllers/user/user.function.controller');

// @route   GET api/user/func/newFoods
// @desc    5 Món mới nhất
// @access  Public
router.get('/newFoods', getNewFood)

// @route   GET api/user/func/topRate
// @desc    Top 10 món được đánh giá tốt nhất
// @access  Public
router.get('/topRate', topRate)

// @route   GET api/user/func/findProducts
// @desc    Tìm món ăn
// @access  Public
router.get('/findProducts', findProducts )

// @route   GET api/user/func/rate
// @desc    Đánh giá
// @access  Private
router.post('/findProducts', protect, rate)

// @route   GET api/user/func/comment
// @desc    Bình luận
// @access  Private
router.post('/comment', protect, comment)

//còn thiếu: add giỏ hàng,mua hàng, thanh toán
module.exports = router;
