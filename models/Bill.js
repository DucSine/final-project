const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  // 'đang xử lý', 'đã xác nhận', 'đã hủy', 'đã thanh toán'
  isCompleted: {
    type: String,
    default: 'đang xử lý',
  },
  restaurantName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

const Bill = mongoose.model('Bill', BillSchema, 'bills');
module.exports = Bill;
