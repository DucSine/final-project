const express = require('express');

const router = express.Router();

const { find } = require('../../controllers/food.controller');

// @route   GET api/user/food?foodTypeId=
// @desc    Tìm kiếm món ăn theo tên và loại
// @access  Public
router.post('/find', find);

module.exports = router;
