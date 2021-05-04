const express = require('express')
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
  resProfile, 
  fogotPassword, 
  otpResetPassword, 
  resetPassword 
} = require('../../controllers/restaurant/auth.controller');
const { protect } = require('../../middlewares/restaurant/auth')
const { hostPage } = require('../../controllers/restaurant/res.function.controller')

// @route   POST api/res/auth/login
// @desc    Đăng nhập
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('password', 'Password ít nhất 8 ký tự').isLength({ min: 8 }),
  ],
  login
)

// @route   POST api/res/auth/register
// @desc    Đăng ký tài khoản
// @access  Public
router.post(
  '/register',
  upload.single('banner'),
  [
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 8 }),
    check('restaurantName', 'Bạn phải nhập tên nhà hàng').not().isEmpty(),
    check('address', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('phone', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('type', 'Bạn phải chọn loại hình nhà hàng').not().isEmpty(),
  ],
  register,
)

// @route   POST api/res/auth/changeEmailRegister
// @desc    Thay đổi email đăng ký
// @access  Public
router.post(
  '/changeEmailRegister',
  [
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('newEmail', 'Bạn phải nhập đúng định dạng email').isEmail(),
  ],
  changeEmailRegister
)

// @route   POST api/res/auth/verificationAccount
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


// @route   POST api/res/auth/changePassword
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

// @route   POST api/res/auth/editAccount
// @desc    Cập nhật tài khoản
// @access  Private
router.post(
  '/editAccount',
 
  upload.single('banner'),
  protect,
  editAccount,
)

// @route   GET api/res/auth/profile
// @desc    Lấy thông tin tài khoản
// @access  Private
router.get('/profile', protect, resProfile )

// @route   POST api/res/auth/fogotPassword
// @desc    Quên mật khẩu (nhận otp)
// @access  Public
router.post(
  '/fogotPassword',
  [check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),],
  fogotPassword
)

// @route   POST api/res/auth/otpResetPassword
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

// @route   POST api/res/auth/resetPassword 
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
