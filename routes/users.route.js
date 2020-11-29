const express = require('express');
const { registerUser } = require('../services/users.service');

const router = express.Router();

router.post('/register', async (req, res) => {
  // TODO: validate req.body

  const user = await registerUser({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).send(user);
});

router.post('/login', (req, res) => {
  res.send('login');
});

exports.usersRoute = router;
