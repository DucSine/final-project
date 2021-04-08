const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const {
  login,
  forgotPassword,
  resetPassword,
} = require('../../controllers/admin/auth.controller');

// @route   POST api/admin/auth/login
// @desc    Đăng nhập
// @access  Public
router.post(
  '/login',
  [
    check('username', 'Enter username').not().isEmpty(),
    check(
      'password', 'Password has at least 8 chars and maximum 30 chars'
    ).isLength({ min: 8, max: 30 }),
  ],
  login,
)

// @route   POST api/admin/auth/forgotPassword
// @desc    Quên mật khẩu
// @access  Public
router.post(
  '/forgotPassword',
  [check('email', 'Email invalidate!').isEmail()],
  forgotPassword,
)

// @route   POST api/admin/auth/resetPassword
// @desc    Reset mật khẩu
// @access  Public
router.post(
  '/resetPassword/:resetToken',
  [
    check(
      'password', 'Password has at least 8 chars and maximum 30 chars'
    ).isLength({ min: 8, max: 30 }),
  ],
  resetPassword,
)

module.exports = router
