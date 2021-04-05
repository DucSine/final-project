const mongoose = require('mongoose');

const FoodTypeSchema = new mongoose.Schema({
  foodTypeName: {
    type: String,
    required: true,
  },
});

const FoodType = mongoose.model('FoodType', FoodTypeSchema, 'food_types');

module.exports = FoodType;
