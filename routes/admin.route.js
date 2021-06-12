const express = require('express')

const router = express.Router()
// HandleErrors
const handleError = require('../helpers/handleError.helper')

const { a_protect } = require('../middlewares/admin/auth')

router.use('/auth', require('./admin/auth.route'))
router.use(handleError)
router.use(a_protect)
router.use(handleError)

router.use('/func', require('./admin/admin.function.route'))
router.use(handleError);
router.use(a_protect)
router.use(handleError)

module.exports = router;
