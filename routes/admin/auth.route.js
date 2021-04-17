const express = require('express')

const router = express.Router()
const { check } = require('express-validator')
const { protect } = require('../../middlewares/admin/auth')
const {
  login, 
  forgotPassword, 
  resetPassword, 
  changePassword,
  otpResetPassword
} = require('../../controllers/admin/auth.controller')


// @route   POST https://khtnfoodoffer.herokuapp.com/api/admin/auth/login
// @desc    Đăng nhập
// @access  Public
router.post(
  '/login',
  [
    check('username', 'Nhập tên đăng nhập.').not().isEmpty(),
    check('password', 'Password tối thiểu 8 ký tự, tối đa 30 ký tự.')
    .isLength({ min: 8, max: 30 }),
  ],
  login,
)

// @route   POST api/admin/auth/forgotPassword
// @desc    Quên mật khẩu
// @access  Public
router.post(
  '/forgotPassword',
  [check('email', 'Email sai!').isEmail()],
  forgotPassword,
)

// @route   POST api/admin/auth/otpResetPassword
// @desc    Xác thực OTP
// @access  Public
router.post(
  '/otpResetPassword',
  [check('OTP', 'Bạn phải nhập OTP').not().isEmpty()],
  otpResetPassword,
)

// @route   POST api/admin/auth/resetPassword
// @desc    Nhập mật khẩu mới
// @access  Public
router.post(
  '/resetPassword',
  [
    check('newPassword', 'Password tối thiểu 8 ký tự, tối đa 30 ký tự')
    .isLength({ min: 8, max: 30 }),
  ],
  resetPassword,
)

// @route   POST api/admin/auth/changePassword
// @desc    Đổi mật khẩu
// @access  Pravite
router.post(
  '/changePassword',
  [
    check('password', 'Password tối thiểu 8 ký tự, tối đa 30 ký tự')
    .isLength({ min: 8, max: 30 }),
    check('newPassword', 'Password tối thiểu 8 ký tự, tối đa 30 ký tự')
    .isLength({ min: 8, max: 30 })
  ],
  protect,
  changePassword,
)

module.exports = router
