const express = require('express')

const router = express.Router()
// HandleErrors
const handleError = require('../helpers/handleError.helper')

const { protect } = require('../middlewares/admin/auth')

router.use('/auth', require('./admin/auth.route'))
router.use(handleError);

router.use(protect)
router.use(handleError)


module.exports = router;
