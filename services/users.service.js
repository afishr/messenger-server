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
    delete result.password;

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

  if (!user || !(await checkPassword(body.password, user.password))) {
    return null;
  }

  user.authToken = this.generateJWT(user);
  delete user.password;
  return user;
};

exports.generateJWT = ({ _id, username, email }) => jwt.sign(
  { _id, username, email },
  process.env.JWT_SECRET,
  { expiresIn: parseInt(process.env.JWT_TTL, 10) },
);

exports.getUserId = (token) => {
  if (token == null) return null;

  const user = jwt.verify(token, process.env.JWT_SECRET, (err, jwtUser) => {
    if (err) {
      return null;
    }
    return jwtUser._id;
  });

  return user;
};

exports.findUserById = async (id) => UserModel.findById(id);

exports.updateUser = async (id, user) => {
  await UserModel.findByIdAndUpdate(id, user, { useFindAndModify: false }).exec();
};

exports.getUserProfile = async (id) => UserModel.findById(id, {
  _id: 0, firstName: 1, lastName: 1, bio: 1,
});

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await UserModel.findById({ _id: userId });

  console.log(userId);

  if (await checkPassword(oldPassword, user.password)) {
    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;

    return user.save();
  }

  return false;
};
