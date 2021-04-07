const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const path = require('path');
const { validationResult } = require('express-validator');

// Models
const User = require('../../models/User');
// const Token = require('../../models/Token');

// const sendEmail = require('../../utils/sendEmail');
const Response = require('../../helpers/response.helper');

const limit = 20;
/*
exports.verifyUsername = async (req, res, next) => {
  const {
    query: { username },
  } = req;

  try {
    const user = await User.findOne({ username });
    if (user) throw new Error('Tên đăng nhập đã tồn tại');
    return Response.success(res, { message: 'Tên đăng nhập hợp lệ' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAll = async (req, res, next) => {
  let { q } = req.query;

  try {
    q = parseInt(q, 10);
    const total = await User.find().count();

    const users = await User.find()
      .skip((q - 1) * limit)
      .limit(limit);

    if (!users) throw new Error('Có lỗi xảy ra');

    return Response.success(res, { users, total });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.find = async (req, res, next) => {
  let { q } = req.query;
  const { name } = req.query;

  try {
    q = parseInt(q, 10);

    let users = await User.find();
    users = users.filter(
      (user) => user.fullName.toLowerCase().indexOf(name.toLowerCase()) > -1,
    );

    const total = users.length;

    // const total = await User.find({
    //   $where: `this.fullName.toLowerCase().indexOf('${name.toLowerCase()}') > -1`,
    // }).count();
    // const users = await User.find({
    //   $where: `this.fullName.toLowerCase().indexOf('${name.toLowerCase()}') > -1`,
    // })
    //   .skip((q - 1) * limit)
    //   .limit(limit);

    if (!users) throw new Error('Có lỗi xảy ra');

    return Response.success(res, {
      users: users.slice((q - 1) * limit, (q - 1) * limit + limit),
      total,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
*/
exports.login = async (req, res, next) => {
  // Validate
  console.log(req);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  // console.log(req.body);

  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('username is incorrect!');
    }

    if (!user.isVerified) throw new Error('The account has not been verified!');

    // Result: boolean
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error('Password is incorrect!');
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return Response.success(res, { token, avatar: user.avatar });
      },
    );

    return true;
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};
/*
exports.register = async (req, res, next) => {
  // Validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    username,
    email,
    password,
    SDT,
    diaChi,
    fullName,
    gioiTinh,
    ngaySinh,
    CMND,
  } = req.body;

  // let { ngaySinh } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      throw new Error('Email đã tồn tại');
    } else user = null;

    user = await User.findOne({ username });

    if (user) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }

    const dateParts = ngaySinh.split('/');

    // Tạo ra salt mã hóa
    const salt = await bcrypt.genSalt(10);
    user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, salt),
      SDT,
      diaChi,
      fullName,
      gioiTinh,
      CMND,
      ngaySinh: new Date(
        parseInt(dateParts[2], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[0], 10),
      ),
      isVerified: true,
      // ngaySinh,
    });

    // // Tạo 1 token -> lưu lại -> gởi email + token -> email gởi lại token hợp lệ -> verified user
    // const token = crypto.randomBytes(16).toString('hex');

    // await Token.create({
    //   user: user._id,
    //   email,
    //   token: crypto.createHash('sha256').update(token).digest('hex'),
    //   tokenExpire: Date.now() + 24 * 60 * 60 * 1000,
    // });

    // // Send email
    // const tokenUrl = `<a href="${req.protocol}://${req.get(
    //   'host',
    // )}/api/auth/confirmation/${token}">${req.protocol}://${req.get(
    //   'host',
    // )}/api/auth/confirmation/${token}</a>`;

    // const message = `<p>Hello ${user.fullName},</p><p>Bạn cần truy cập vào link sau để xác nhận tài khoản:</p><p>${tokenUrl}</p>`;
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Account verification token',
    //   message,
    // });

    return Response.success(res, { message: 'Tạo tài khoản thành công' });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

exports.getMe = (req, res) => {
  const { user } = req;
  return Response.success(res, { user });
};

exports.update = async (req, res, next) => {
  // Validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user } = req;
  const { ngaySinh } = req.body;
  try {
    const currentUser = await User.findByIdAndUpdate(user._id, {
      $set: { ...req.body, ngaySinh: new Date(ngaySinh) },
    });
    if (!currentUser) throw new Error('Có lỗi xảy ra');
    return Response.success(res, { message: 'Cập nhật thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  // Validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let {
    body: { newPassword },
  } = req;

  const {
    user,
    body: { password },
  } = req;

  try {
    // Result: boolean
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error('Bạn nhập sai mật khẩu');
    }

    // Tạo ra salt mã hóa
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id, { $set: { password: newPassword } });

    return Response.success(res, { message: 'Cập nhật thành công' });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
*/