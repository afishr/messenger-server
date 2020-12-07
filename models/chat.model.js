const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
  timeCreated: { type: Date, required: true, default: Date.now()}
});

exports.ChatModel = mongoose.model('Chat', chatSchema);
