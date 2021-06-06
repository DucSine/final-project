const express = require('express')
const multer = require('multer')

const router = express.Router()
const upload = multer({ dest: './resources/uploads' })
const { check } = require('express-validator')

const {
    getFood,
    addFood,
    editFood,
    delFood,
    getBillDetail,
    confirmBill,
    cancelBill,
    createDiscount,
    getDiscountById,
    getLoyalUserDetail,
    getLoyalUserHisTrans,
    getDataReport
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

// @route   GET api/res/func/getBillDetail
// @desc    Xem chi tiết bill
// @access  Private
router.get('/getBillDetail', protect, getBillDetail)

// @route   POST api/res/func/confirmBill?foodId=
// @desc    Xác nhận bill
// @access  Private
router.post('/confirmBill', protect, confirmBill)

// @route   POST api/res/func/cancelBill?foodId=
// @desc    Hủy bill
// @access  Private
router.post('/cancelBill', protect, cancelBill)

// @route   POST api/res/func/createDiscount
// @desc    Tạo mã giảm giá
// @access  Private
router.post('/createDiscount', protect, createDiscount)

// @route   GET api/res/func/getLoyalUser
// @desc    Xem chi tiết khách hàng thân thiết
// @access  Public
router.get('/getLoyalUser', protect, getLoyalUserDetail)

// @route   GET api/res/func/getLoyalUserHisTrans
// @desc    Xem lịch sử giao dịch
// @access  Private
router.get('/getLoyalUserHisTrans', protect, getLoyalUserHisTrans)

// @route   GET api/res/func/getDiscountById
// @desc    Xem chi tiết mã giảm giá
// @access  Private
router.get('/getDiscountById', protect, getDiscountById)

// @route   GET api/res/func/getDataReport
// @desc    Data report
// @access  Private
router.get('/getDataReport', protect, getDataReport)


module.exports = router
