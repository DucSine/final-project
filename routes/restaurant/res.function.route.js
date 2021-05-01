const express = require('express')
const multer = require('multer') 

const router = express.Router()
const upload = multer({dest: './resources/uploads'}) 
const { check } = require('express-validator')

const { getFood, addFood } = require('../../controllers/restaurant/res.function.controller')
const { protect } = require('../../middlewares/restaurant/auth')

// @route   POST api/res/func/getFood
// @desc    Xem danh sách món ăn
// @access  Private
router.get( '/getFood', protect, getFood )
  
// @route   POST api/res/func/addFood
// @desc    Đăng nhập
// @access  Private
//router.get( '/getFood', upload.single('image') , addFood )

module.exports = router
