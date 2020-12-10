const express = require('express');
const { authGuard } = require('../middlewares/auth.middleware');
const { updateUser, getUserProfile, findUserById } = require('../services/users.service');

const router = express.Router();

router.put('/', authGuard, async (req, res) => {
    const user = await findUserById(req.user._id);
    user.firstName = req.body.user.firstName;
    user.lastName = req.body.user.lastName;
    user.bio = req.body.user.bio;

    await updateUser(req.user._id, user)
  
    res.status(200).send();
  })
  

router.get('/username', authGuard, (req, res) => {
    const username = req.user.username
    res.status(200).send({ username });
});

router.get('/profile', authGuard, async (req, res) => {
    const user = await getUserProfile(req.user._id);
    res.status(200).send(user);
});

exports.userRoute = router;
