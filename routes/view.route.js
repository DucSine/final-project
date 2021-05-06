const express = require('express')

const router = express.Router()

const handleError = require('../helpers/handleError.helper')
const { protect } = require('../middlewares/restaurant/auth')
const { 
    resIntroduce,
    resHostpage 
} = require('../controllers/restaurant/res.function.controller')

const{ 
    resetPage, 
    resetPass 
} = require('../controllers/general.controller')
const { adminLogin } = require('../controllers/admin/admin.function.comtroller')

// @route   GET /
// @desc    restaurant introduce page
// @access  Public
router.get('/', resIntroduce)

// @route   GET /changeMail
// @desc    restaurant change after register
// @access  Public


// @route   GET /res_hostpage/
// @desc    restaurant hostpage
// @access  Private
router.get('/res_hostpage', protect, resHostpage)

// @route   GET /admin_signin
// @desc    admin login
// @access  Public
router.get('/admin/login', adminLogin)

// @route   GET /admin_login
// @desc    admin login
// @access  Public


// @route   GET /resetpass
// @desc    Reset password page
// @access  Public
router.get('/reset', resetPage)

// @route   GET /resetpass
// @desc    Reset password page
// @access  Public
router.post('/resetpass', resetPass)

// post, reset xong chuyen trang dang nhap

module.exports = router

