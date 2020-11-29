const express = require('express');
const { CommonError } = require('../errors/common.error');
const { registerUser } = require('../services/users.service');

const router = express.Router();

router.post('/register', async (req, res) => {
  // TODO: validate req.body

  const { user, error } = await registerUser({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  if (error) {
    return res.status(500).send(new CommonError(error.name, error.message, 500));
  }

  return res.status(201).send(user);
});

router.post('/login', (req, res) => {
  res.send('login');
});

exports.usersRoute = router;
