const express = require('express')
const multer = require('multer') 

const router = express.Router()
const upload = multer({dest: './resources/uploads'}) 
const {
    hostPage,

} = require('../../controllers/restaurant/views.controller')
const { protect } = require('../../middlewares/restaurant/auth')

router.get('/hostpage', hostPage)

module.exports = router