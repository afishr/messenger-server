const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  participants: { type: String, required: true },
  messages: { type: String, required: true },
  content: { type: String, required: true, index: { unique: true } },
  time_created: { type: Date, required: true, default: Date.now()}
});

exports.UserModel = mongoose.model('User', userSchema);