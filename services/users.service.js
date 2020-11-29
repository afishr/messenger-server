const { UserModel } = require('../models/user.model');

exports.registerUser = (body) => {
  const user = new UserModel({
    username: body.username,
    email: body.email,
    password: body.password,
  });

  return user.save();
};

exports.loginUser = () => {

};
