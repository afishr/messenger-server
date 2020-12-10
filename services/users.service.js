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
    const result = (await user.save()).toObject();

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

  if (!user || !checkPassword(body.password, user.password)) {
    return null;
  }

  user.authToken = this.generateJWT(user);
  delete user.password;
  return user;
};

exports.generateJWT = ({ _id, username, email }) => jwt.sign(
  { _id, username, email },
  process.env.JWT_SECRET,
  { expiresIn: parseInt(process.env.JWT_TTL) },
);

exports.getUserId = (token) => {
  if (token == null) return null;

  user = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return null
    }
    return user._id
  });
  
  return user
}

exports.findUserById = async (id) => {
  return await UserModel.findById(id)
}

exports.updateUser = async (id, user) => {
  time = new Date().getTime();
  console.log(user)
  await UserModel.findByIdAndUpdate(id, user, {useFindAndModify: false}).exec()
}

exports.getUserProfile = async (id) => {
  return await UserModel.findById(id, { _id: 0, firstName: 1, lastName: 1, bio: 1, username: 1, email: 1 })
}

exports.getUserByUsername = async (username) => {
  return await UserModel.findOne({username}, {username: 1})
}
