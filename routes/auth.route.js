const express = require('express');
const { CommonError } = require('../errors/common.error');
const { registerUser, loginUser } = require('../services/users.service');

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

  res.send(user);
});

exports.authRoute = router;
