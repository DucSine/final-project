const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const crypto = require('crypto')

const sendEmail = require('../../utils/sendEmail')
const Response = require('../../helpers/response.helper')

exports.login = async (req, res, next) => {
  const errors = validationResult(req)

  try {
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { username, password } = req.body;

    if (username !== process.env.ADMIN_NAME)
      return next(new Error('Username is incorrect!'))

    const result = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);

    if (!result) return next(new Error('Password is incorrect!'));

    const payload = {
      admin: {
        username: username,
        password,
      },
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => err ? next(err) : Response.success(res, { token })
    )

    return true;
  } catch (error) {
    console.log(error);
    return next(new Error('Error occurred!'));
  }
};

exports.forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  if (email !== process.env.ADMIN_EMAIL)
    return next(new Error('Email is incorrect!'));

  // Create password reset token
  const resetToken = crypto.randomBytes(16).toString('hex');

  process.env.ADMIN_RESETTOKEN = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log('envTK: '+ process.env.ADMIN_RESETTOKEN)
  try {
    // Send email
    const tokenUrl = `<a href="${req.protocol}://${req.get(
      'host',
    )}/admin/confirmationForgotPassword/${resetToken}">${
      req.protocol
    }://${req.get('host')}/admin/confirmationForgotPassword/${resetToken}</a>`;

    const message = `<p>Bạn cần truy cập vào link sau để xác nhận tài khoản:</p><p>${tokenUrl}</p>`;
    await sendEmail({
      email: email,
      subject: 'Forgot Password - Admin',
      message,
    });

    return Response.success(res, {
      message: 'Email reset password đã được gởi',
      token: resetToken,
    });
  } catch (error) {
    console.log(error);
    process.env.ADMIN_RESETTOKEN = '';
    return next(new Error('Error occurred!'));
  }
};

exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  if (resetToken !== process.env.ADMIN_RESETTOKEN)
    return next(new Error('Reset token không hợp lệ'));

  try {
    const salt = await bcrypt.genSalt(10);
    process.env.ADMIN_PASSWORD = await bcrypt.hash(req.body.password, salt);

    const payload = {
      admin: {
        name: process.env.ADMIN_NAME,
        password: process.env.ADMIN_PASSWORD,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) return next(err);
        return Response.success(res, { token });
      },
    );

    return true;
  } catch (error) {
    console.log(error);
    return next(new Error('Có lỗi xảy ra'));
  }
};
