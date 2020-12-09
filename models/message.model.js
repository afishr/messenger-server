const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  timeSent: { type: Date, required: true, default: Date.now() },
  status: { type: String, enum: ['Sent', 'Read'], default: 'Sent' },
});

exports.MessageModel = mongoose.model('Message', messageSchema);
