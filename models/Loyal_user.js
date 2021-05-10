const mongoose = require('mongoose');

const LoyalUserSchema = new mongoose.Schema({
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
    point: {
        type: Number,
        required: true,
        default: 0
    },
});

module.exports = mongoose.model('LoyalUser', LoyalUserSchema, 'loyal_user');
