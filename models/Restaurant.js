const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  phone: {
    type: String,
    required: true,
  },
  adress: {
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