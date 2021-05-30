const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  fullName: {
    type: String,
    required: false,
  },

  phone: {
    type: String,
    required: false,
  },

  address: {
    type: String,
    required: false,
  },

  bDate: {
    type: Date,
    required: false,
  },

  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/ducsine/image/upload/v1620808216/iv2rjt6cm5b2mueqkmfq.jpg',
  },

  ID: {
    type: String,
    required: false,
  },

  gender: {
    type: Boolean,
    default: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  isLock: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema, 'users');
