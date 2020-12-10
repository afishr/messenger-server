const express = require('express');
const { CommonError } = require('../errors/common.error');
const { registerUser, loginUser, updateUser } = require('../services/users.service');
const { authGuard } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', async (req, res) => {
  // TODO: validate req.body

  const { user, error } = await registerUser({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  if (error) {
    return res.status(500).send(new CommonError(error, 500));
  }

  return res.status(201).send(user);
});

router.post('/login', async (req, res) => {
  const user = await loginUser({
    uniqueKey: req.body.username || req.body.email,
    password: req.body.password,
  });

  if (!user) return res.status(403).send('Unauthorized');

  return res.send(user);
});

router.put('/', authGuard, async (req, res) => {
  await updateUser({
    id: req.user._id,
    username: req.body.username,
    email: req.body.email,
  });

  res.status(200).send();
});

exports.authRoute = router;
