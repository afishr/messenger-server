const { UserModel } = require('../models/user.model');

exports.registerUser = async (body) => {
  const user = new UserModel({
    username: body.username,
    email: body.email,
    password: body.password,
  });

  try {
    await user.save();

    return {
      user,
      error: null,
    };
  } catch (error) {
    return {
      error,
      user: null,
    };
  }
};

exports.loginUser = () => {

};
