const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  dateBirth: { type: Date },
  timeCreated: { type: Date, required: true, default: Date.now()},
  lastUpdated: { type: Date },
  lastName: { type: String },
  firstName: { type: String},
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }]
});

exports.UserModel = mongoose.model('User', userSchema);
