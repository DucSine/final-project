const mongoose = require('mongoose');

const CTBillSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true,
  },
});

const BillDetail = mongoose.model('Bill_Detail', CTBillSchema, 'bill_detail');
module.exports = BillDetail;
