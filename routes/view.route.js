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
    resetPass, 
    resAuthToken
} = require('../controllers/general.controller')
const { adminLogin, adminHostPage } = require('../controllers/admin/admin.function.comtroller')
const { a_protect } = require('../middlewares/admin/auth')

// @route   GET /
// @desc    restaurant introduce page
// @access  Public
router.get('/', resIntroduce)

// @route   GET /res_hostpage
// @desc    restaurant introduce page
// @access  Private
router.get('/res_hostpage', protect, resHostpage)

// @route   GET /changeMail
// @desc    restaurant change after register
// @access  Public

// @route   GET /admin/admin_login
// @desc    admin login
// @access  Public
router.get('/admin_login', adminLogin)

// @route   GET /admin/login
// @desc    admin login
// @access  Private
router.get('/admin_hostpage', a_protect ,adminHostPage)

// @route   GET /reset
// @desc    Reset password page
// @access  Public
router.get('/reset', resetPage)

// @route   GET /resetpass
// @desc    Reset password page
// @access  Public
router.post('/resetpass', resetPass)

// post, reset xong chuyen trang dang nhap

// @route   POST /auth
// @desc    Xác thực tài khoản
// @access  Public
router.get('/auth', resAuthToken)
module.exports = router

