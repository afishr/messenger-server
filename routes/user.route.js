const express = require('express');
const { authGuard } = require('../middlewares/auth.middleware');
const { getChats } = require('../services/chats.service');
const {
  updateUser, getUserProfile, findUserById, changePassword, getUserByUsername
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
  res.status(200).send({ user });
});

router.post('/change-password', authGuard, async (req, res) => {
  const result = await changePassword(req.user._id, req.body.oldPassword, req.body.newPassword);
  res.sendStatus(result ? 200 : 403);
});

router.get('/chats', authGuard, async (req, res) => {
    const chats = await getChats(req.user._id);
    return res.status(200).send({ chats });
})

router.get("/:username", authGuard, async (req, res) => {
    const user = await getUserByUsername(req.params.username);
    return res.status(200).send(user);
})

exports.userRoute = router;
