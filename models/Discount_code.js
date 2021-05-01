const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: false,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    amount: {
        type: Number,
        required: true,
        default: 1
    },
    code:{
        type: String,
        required:true
    },
    discount:{
        type: Number,
        required: true
    },
    dateExprite: Date,
    dateCreate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('DiscountCode', DiscountSchema, 'discount_code');
