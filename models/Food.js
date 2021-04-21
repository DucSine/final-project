const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  foodName: {
    type: String,
     required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: 'https://picsum.photos/200',
  },
  caption: {
    type: String,
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  buys: {
    type: Number,
    default: 0
  },
  rate: {
    type: Number,
    default: 0
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Food = mongoose.model('Food', FoodSchema, 'foods');
module.exports = Food;
