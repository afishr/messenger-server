const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const { Schema } = mongoose;
// const SALT_WORK_FACTOR = 10;

const User = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
});
