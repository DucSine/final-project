const express = require('express')
const multer = require('multer')

const router = express.Router()
const upload = multer({ dest: './resources/uploads' })
const { check } = require('express-validator')

const {protect} = require('../../middlewares/admin/auth')
const { adminHostPage } = require('../../controllers/admin/admin.function.comtroller')

// @route   GET api/admin/func/hostPage
// @desc    Lấy toàn bộ tên món ăn, param: p= 1,2,...
// @access  Public


module.exports = router;