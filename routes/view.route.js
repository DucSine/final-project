const express = require('express')

const router = express.Router()

const handleError = require('../helpers/handleError.helper')

router.use('/admin', require('./admin.route'))

router.use(handleError)

router.get('/',(req,res)=>res.render('../views/restaurant/index'))

router.use('/res', require('./restaurant.route'))

router.use(handleError)

module.exports = router
