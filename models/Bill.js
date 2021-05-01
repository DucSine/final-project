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
  discount:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discount',
    required: false
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Bill = mongoose.model('Bill', BillSchema, 'bills');
module.exports = Bill;
