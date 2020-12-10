const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages", default: [] }],
  timeCreated: { type: Date, required: true, default: Date.now() },
  lastActivity: { type: Date, required: true, default: Date.now() },
});

exports.ChatModel = mongoose.model('Chat', chatSchema);
