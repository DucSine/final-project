const express = require('express')
const multer = require('multer')

const router = express.Router()
const upload = multer({ dest: './resources/uploads' })
const { check } = require('express-validator')

const { 
    getFood, 
    addFood, 
    editFood ,
    delFood
} = require('../../controllers/restaurant/res.function.controller')
const { protect } = require('../../middlewares/restaurant/auth')

// @route   GET api/res/func/getFood
// @desc    Xem chi tiết món ăn
// @access  Private
router.get('/getFood', protect, getFood)

// @route   POST api/res/func/addFood
// @desc    Thêm sản phẩm
// @access  Private
router.post(
    '/addFood',
    protect,
    upload.single('image'),
    [
        check('foodName', 'Bạn phải nhập tên món').not().isEmpty(),
        check('price', 'Bạn phải nhập giá sản phẩm.').isFloat(),
    ],
    addFood)

// @route   POST api/res/func/editFood
// @desc    Cập nhật sản phẩm
// @access  Private
router.post(
    '/editFood',
    protect,
    upload.single('image'),
    [
        check('foodName', 'Bạn phải nhập tên món').not().isEmpty(),
        check('price', 'Bạn phải nhập giá sản phẩm.').isFloat(),
    ],
    editFood)

// @route   POST api/res/func/delFood
// @desc    Xóa sản phẩm
// @access  Private
router.post('/delFood', protect, delFood)
    
module.exports = router
