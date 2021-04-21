const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  authCode: {
    type: String,
    required: true,
  },
  otpExpire: Date, 
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AuthCode', AuthSchema, 'auth_code');
