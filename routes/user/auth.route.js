const express = require('express');

const { check } = require('express-validator')

const router = express.Router()

const {
  login, 
  register,
  editEmailRegister,
  editPassword,
  verificationAccount,
  editAccount,
  userProfile,
  changeAvatar
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
    check('adress', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('phone', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('gender', 'Bạn phải chọn giới tính').not().isEmpty(),
    check('ID', 'Bạn phải nhập số CMND').not().isEmpty(),
    check('bDate', 'Bạn phải nhập ngày sinh, định dạng dd/MM/yyyy').not().isEmpty(),
  ],
  register,
)

// @route   POST api/user/auth/editEmailRegister
// @desc    Thay đổi email đăng ký
// @access  Public
router.post(
  '/editEmailRegister',
  [
    check('username', 'Bạn phải nhập tên').not().isEmpty(),
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
  ],
  editEmailRegister
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


// @route   POST api/user/auth/editPassword
// @desc    Đổi mật khẩu
// @access  Private
router.post(
  '/editPassword',
  [
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 8 }),
    check('newPassword', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({
      min: 8,
    }),
  ],
  protect,
  editPassword,
);

// @route   POST api/user/auth/editAccount
// @desc    Cập nhật tài khoản
// @access  Private
router.post(
  '/editAccount',
  [
    check('fullName', 'Bạn phải nhập họ tên').not().isEmpty(),
    check('adress', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('phone', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('gender', 'Bạn phải chọn giới tính').not().isEmpty(),
    check('ID', 'Bạn phải nhập số CMND').not().isEmpty(),
    check('bDate', 'Bạn phải nhập ngày sinh').not().isEmpty(),
  ],
  protect,
  editAccount,
);

// @route   GET api/admin/auth/profile
// @desc    Lấy thông tin tài khoản
// @access  Private
router.get('/userProfile', protect, userProfile)

// @route   GET api/admin/auth/profile
// @desc    Lấy thông tin tài khoản
// @access  Private
router.get('/changeAvatar', protect, changeAvatar)


module.exports = router
