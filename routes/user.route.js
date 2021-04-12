const express = require('express')

const router = express.Router()

const handleError = require('../helpers/handleError.helper')

const { protect } = require('../middlewares/user/auth')

router.use('/auth', require('./user/auth.route'))

router.use(handleError)
/*
router.use('/restaurant', require('./user/restaurant.route'));

router.use(handleError);
*/
router.use('/func', require('./user/user.function.route'));

router.use(handleError)


router.use(handleError);
/*
router.use('/mail', require('./user/mail.route'));

router.use(handleError);

router.use('/cart', require('./user/cart.route'));

router.use(handleError);

router.use('/bill', require('./user/bill.route'));

router.use(handleError);

router.use('/comment', require('./user/comment.route'));

router.use(handleError);

router.use('/star', require('./user/star.route'));

router.use(handleError);
*/
module.exports = router
