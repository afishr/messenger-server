const express = require('express');
const { authGuard } = require('../middlewares/auth.middleware');
const {
  updateUser, getUserProfile, findUserById, changePassword,
} = require('../services/users.service');

const router = express.Router();

router.put('/', authGuard, async (req, res) => {
  const user = await findUserById(req.user._id);
  user.firstName = req.body.user.firstName;
  user.lastName = req.body.user.lastName;
  user.bio = req.body.user.bio;

  await updateUser(req.user._id, user);

  res.status(200).send();
});

router.get('/username', authGuard, (req, res) => {
  const { username } = req.user;
  res.status(200).send({ username });
});

router.get('/profile', authGuard, async (req, res) => {
  const user = await getUserProfile(req.user._id);
  res.status(200).send(user);
});

router.post('/change-password', authGuard, async (req, res) => {
  const result = await changePassword(req.user._id, req.body.oldPassword, req.body.newPassword);
  res.sendStatus(result ? 200 : 403);
});

exports.userRoute = router;
