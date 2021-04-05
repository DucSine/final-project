const mongoose = require('mongoose');

const MailSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isWatched: {
    type: Boolean,
    default: false,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const Mail = mongoose.model('Mail', MailSchema, 'mails');
module.exports = Mail;
