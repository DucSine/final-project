const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
  object: {
    type: String,
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sort: {
    type: Number,
    default: 0
  },
  isWatched: {
    type: Boolean,
    default: false
  }
});

const Messages = mongoose.model('Messages', MessagesSchema, 'messages');

module.exports = Messages;
