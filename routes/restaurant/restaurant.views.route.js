const express = require('express')
const multer = require('multer') 

const router = express.Router()
const upload = multer({dest: './resources/uploads'}) 
const {
    hostPage,

} = require('../../controllers/restaurant/views.controller')
const { protect } = require('../../middlewares/restaurant/auth')

// @route   GET /res/hostpage
// @desc    Trang chủ sau khi đăng nhập
// @access  Public
router.get('/hostpage', protect, hostPage)

module.exports = router