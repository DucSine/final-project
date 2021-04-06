const mongoose = require('mongoose');

const FoodTypeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
});

const FoodType = mongoose.model('FoodType', FoodTypeSchema, 'food_types');

module.exports = FoodType;
