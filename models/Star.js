const mongoose = require('mongoose');

const StarSchema = new mongoose.Schema({
  rate: Number,
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Star = mongoose.model('Star', StarSchema, 'stars');
module.exports = Star;
