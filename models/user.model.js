const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  timeCreated: { type: Date, required: true, default: Date.now()},
  lastUpdated: { type: Date },
  lastName: { type: String, default: null },
  firstName: { type: String, default: null },
  bio: { type: String, default: null },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  isValidated: { type: Boolean, default: false }
});

exports.UserModel = mongoose.model('User', userSchema);
