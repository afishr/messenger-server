const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  user: { type: String, required: true },
  toUser: { type: String, required: true },
  content: { type: String, required: true, index: { unique: true } },
  timeSent: { type: Date, required: true, default: Date.now()}

});

exports.UserModel = mongoose.model('User', userSchema);