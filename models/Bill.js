const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  // 'đang xử lý', 'đã xác nhận', 'đã hủy', 'đã thanh toán'
  status: {
    type: String,
    default: 'đang xử lý',
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  discount_code:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discount_code',
    default: null
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
  total:{
    type: Number,
    default: 0    
  },
  message: {
    type: String,
    default: null
  }
});

const Bill = mongoose.model('Bill', BillSchema, 'bills');
module.exports = Bill;
