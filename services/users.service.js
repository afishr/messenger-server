const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/user.model');

const SALT_WORK_FACTOR = 10;

const hashPassword = async (plainTextPassword) => {
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(plainTextPassword, salt);

  return hash;
};

const checkPassword = (candidatePassword, hash) => bcrypt.compare(candidatePassword, hash);

exports.registerUser = async (body) => {
  const hashedPassword = await hashPassword(body.password);
  const user = new UserModel({
    username: body.username,
    email: body.email,
    password: hashedPassword,
  });

  try {
    const result = await (await user.save()).toObject();

    result.authToken = this.generateJWT(user);

    return {
      user: result,
      error: null,
    };
  } catch (error) {
    return {
      error,
      user: null,
    };
  }
};

exports.loginUser = async (body) => {
  const user = await UserModel.findOne({
    $or: [
      { username: body.uniqueKey },
      { email: body.uniqueKey },
    ],
  }).lean();

  if (!user || !checkPassword(body.password, user.password)) {
    return null;
  }

  user.authToken = this.generateJWT(user);

  return user;
};

exports.generateJWT = ({ _id, username, email }) => jwt.sign(
  { _id, username, email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_TTL },
);
