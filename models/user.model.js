const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String, required: true, index: { unique: true }, min: 7, max: 20,
  },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  timeCreated: { type: Date, required: true, default: Date.now() },
  lastUpdated: { type: Date },
  lastName: { type: String, default: null },
  firstName: { type: String, default: null },
  bio: { type: String, default: null },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  isEmailConfirmed: { type: Boolean, default: false },
  emailConfirmToken: { type: String, default: null },
});

exports.UserModel = mongoose.model('User', userSchema);
