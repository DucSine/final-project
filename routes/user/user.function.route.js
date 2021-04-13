const express = require('express')

const router = express.Router()

const { 
    rate, 
    comment
} = require('../../controllers/user/user.function.controller')


// @route   GET api/user/func/rate
// @desc    Đánh giá
// @access  Private
router.post('/rate', rate)

// @route   GET api/user/func/comment
// @desc    Bình luận
// @access  Private
//router.post('/comment', protect, comment)

//còn thiếu: add giỏ hàng,mua hàng, thanh toán
module.exports = router;
