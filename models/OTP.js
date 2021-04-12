const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  OTP: {
    type: String,
    required: true,
  },
  otpExpire: Date, 
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('OTP', OTPSchema, 'otp');
