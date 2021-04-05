const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Response = require('../../helpers/response.helper');

exports.protect = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.authorization;

  try {
    if (!token) throw new Error('Không tìm thấy token');
    const decode = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

    if (decode.admin.name !== process.env.ADMIN_NAME)
      throw new Error('Token không hợp lệ');

    const result = await bcrypt.compare(
      decode.admin.password,
      process.env.ADMIN_PASSWORD,
    );

    if (!result) throw new Error('Token không hợp lệ');

    req.admin = { ...decode.admin };
    return next();
  } catch (error) {
    console.log(error);
    return Response.error(res, { message: error.message });
  }
};
