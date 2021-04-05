const mongoose = require('mongoose');

const RestaurantTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

const RestaurantType = mongoose.model(
  'RestaurantType',
  RestaurantTypeSchema,
  'restaurant_types',
);

module.exports = RestaurantType;
