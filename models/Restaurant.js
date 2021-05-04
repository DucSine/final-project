const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  restaurantName: {
    type: String,
    required: true
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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dateGeneral: {
    type: Date,
    default: Date.now(),
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RestaurantType',
    required: true,
  },
  location: {
    x: Number,
    y: Number,
  },
  banner: {
    type: String,
    default: 'https://picsum.photos/200',
  },
});

const Restaurant = mongoose.model(
  'Restaurant',
  RestaurantSchema,
  'restaurants',
);

module.exports = Restaurant