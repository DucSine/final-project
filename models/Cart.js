const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Cart = mongoose.model('Cart', CartSchema, 'carts');
module.exports = Cart;
