const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'https://picsum.photos/200',
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodType',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Food = mongoose.model('Food', FoodSchema, 'foods');
module.exports = Food;
