const express = require('express');

const { check } = require('express-validator');

const router = express.Router();

const {
  login
} = require('../../controllers/user/auth.controller');
const { protect } = require('../../middlewares/user/auth');
/*
// @route   POST api/user/auth
// @desc    Danh sách người dùng
// @access  Public
router.get('/', getAll);

// @route   POST api/user/auth/find
// @desc    Tìm kiếm người dùng
// @access  Public
router.get('/find', find);
*/
// @route   POST api/user/auth/login
// @desc    Đăng nhập
// @access  Public
router.post(
  '/login',
  [
    check('username', 'Enter username').not().isEmpty(),
    check('password', 'Password has at least 8 chars').isLength({ min: 8 }),
  ],
  login,
);
/*
// @route   POST api/admin/auth/register
// @desc    Đăng ký tài khoản
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Bạn phải nhập tên').not().isEmpty(),
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 8 }),
    check('fullName', 'Bạn phải nhập họ tên').not().isEmpty(),
    check('diaChi', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('SDT', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('gioiTinh', 'Bạn phải chọn giới tính').not().isEmpty(),
    check('CMND', 'Bạn phải nhập số CMND').not().isEmpty(),
    check('ngaySinh', 'Bạn phải nhập ngày sinh').not().isEmpty(),
  ],
  register,
);

// @route   GET api/admin/auth/verifyUsername?username=''
// @desc    Lấy thông tin tài khoản
// @access  Private
router.get('/verifyUsername', verifyUsername);

// @route   POST api/admin/auth/updatePassword
// @desc    Cập nhật mật khẩu
// @access  Private
router.post(
  '/updatePassword',
  [
    check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 8 }),
    check('newPassword', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({
      min: 8,
    }),
  ],
  protect,
  updatePassword,
);

// @route   POST api/admin/auth/update
// @desc    Cập nhật tài khoản
// @access  Private
router.post(
  '/update',
  [
    // check('username', 'Bạn phải nhập tên').not().isEmpty(),
    check('email', 'Bạn phải nhập đúng định dạng email').isEmail(),
    // check('password', 'Mật khẩu phải nhiều hơn 8 ký tự').isLength({ min: 8 }),
    check('fullName', 'Bạn phải nhập họ tên').not().isEmpty(),
    check('diaChi', 'Bạn phải nhập địa chỉ').not().isEmpty(),
    check('SDT', 'Bạn phải nhập số điện thoại').not().isEmpty(),
    check('gioiTinh', 'Bạn phải chọn giới tính').not().isEmpty(),
    check('CMND', 'Bạn phải nhập số CMND').not().isEmpty(),
    check('ngaySinh', 'Bạn phải nhập ngày sinh').not().isEmpty(),
  ],
  protect,
  update,
);

// @route   GET api/admin/auth/getMe
// @desc    Lấy thông tin tài khoản
// @access  Private
router.get('/getMe', protect, getMe);
*/
module.exports = router
