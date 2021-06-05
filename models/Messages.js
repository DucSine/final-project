const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
  object: {
    type: String,
    required: true,
  },
  dateCreate:{
    type: Date,
    default: Date.now(),
  },
  title:{
    type: String,
    required: true
  },
  message:{
    type: String,
    required: true
  },
});

const Messages = mongoose.model('Messages', MessagesSchema, 'messages');

module.exports = Messages;
