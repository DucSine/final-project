const express = require('express')
const multer = require('multer') 

const router = express.Router()
const upload = multer({dest: './resources/uploads'}) 
const {index} = require('../../controllers/restaurant/resviews.controller')

router.get('/index', index)

module.exports = router