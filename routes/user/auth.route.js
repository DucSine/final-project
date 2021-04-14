const express = require('express');
const multer = require('multer')

const router = express.Router()
const upload = multer({dest: './resources/uploads'})
const { check } = require('express-validator')


const {
  login, 
  register,
  changeEmailRegister,
  verificationAccount,
  changePassword,
  editAccount,
  userProfile,
  fogotPassword,
  otpResetPassword,
  resetPassword,
} = require('../../controllers/user/auth.controller')
const { protect } = require('../../middlewares/user/auth')


// @route   POST api/user/auth/login
// @desc    Đăng nhập
// @access  Public
router.post(
  '/login',
  [
    check('username', 'username không được bỏ trống!').not().isEmpty(),
    check('password', 'Password ít nhất 8 ký tự').isLength({ min: 8 }),
  ],
  login
)

// @route   POST api/user/auth/register
// @desc    Đăng ký tài khoản
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Bạn phải nhập tên').not().isEmpty(),
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 8 }),
    check('fullName', 'Bạn phải nhập họ tên').not().isEmpty(),
    check('address', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('phone', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('gender', 'Bạn phải chọn giới tính').not().isEmpty(),
    check('ID', 'Bạn phải nhập số CMND').not().isEmpty(),
    check('bDate', 'Bạn phải nhập ngày sinh, định dạng dd/MM/yyyy').not().isEmpty(),
  ],
  upload.single('avatar'),
  register,
)

// @route   POST api/user/auth/changeEmailRegister
// @desc    Thay đổi email đăng ký
// @access  Public
router.post(
  '/changeEmailRegister',
  [
    check('username', 'Bạn phải nhập tên').not().isEmpty(),
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
  ],
  changeEmailRegister
)

// @route   POST api/user/auth/verificationAccount
// @desc    Kích hoạt tài khoản
// @access  Public
router.post(
  '/verificationAccount',
  [
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('OTP','Bạn phải nhập số CMND').not().isEmpty()
  ],
  verificationAccount
)


// @route   POST api/user/auth/changePassword
// @desc    Đổi mật khẩu
// @access  Private
router.post(
  '/changePassword',
  [
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 8 }),
    check('newPassword', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({min: 8}),
  ],
  protect,
  changePassword,
);

// @route   POST api/user/auth/editAccount
// @desc    Cập nhật tài khoản
// @access  Private
router.post(
  '/editAccount',
  [
    check('fullName', 'Bạn phải nhập họ tên').not().isEmpty(),
    check('address', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('phone', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('gender', 'Bạn phải chọn giới tính').not().isEmpty(),
    check('ID', 'Bạn phải nhập số CMND').not().isEmpty(),
    check('bDate', 'Bạn phải nhập ngày sinh').not().isEmpty(),
  ],
  protect,
  upload.single('avatar'),
  editAccount,
)

// @route   GET api/user/auth/profile
// @desc    Lấy thông tin tài khoản
// @access  Private
router.get(
  '/userProfile', 
  protect, 
  userProfile
)

// @route   POST api/user/auth/fogotPassword
// @desc    Quên mật khẩu (nhận otp)
// @access  Public
router.post(
  '/fogotPassword',
  [check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),],
  fogotPassword
)

// @route   POST api/user/auth/otpResetPassword
// @desc    Quên mật khẩu (nhập otp)
// @access  Public
router.post(
  '/otpResetPassword',
  [
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('OTP', 'Bạn phải nhập OTP').not().isEmpty()
  ],
  otpResetPassword
)

// @route   POST api/user/auth/resetPassword 
// @desc    Quên mật khẩu (nhập mật khẩu mới)
// @access  Public
router.post(
  '/resetPassword',
  [
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('OTP', 'Bạn phải nhập OTP').not().isEmpty()
  ],
  resetPassword
)

module.exports = router
