const jwt = require('jsonwebtoken');

const Response = require('../../helpers/response.helper');

// Models
const Restaurant = require('../../models/Restaurant');

exports.protect = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.authorization;

  try {
    if (!token) throw new Error('Không tìm thấy token');
    const decode = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    const restaurant = await Restaurant.findById(decode.restaurantManager.id);
    if (!restaurant) throw new Error('Token không hợp lệ');
    req.restaurantManager = restaurant;
    return next();
  } catch (error) {
    console.log(error);
    return Response.error(res, { message: error.message });
  }
};
