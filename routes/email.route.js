const express = require('express');
const { confirmEmail } = require('../services/users.service');

const router = express.Router();

router.get('/confirm', async (req, res) => {
  const result = await confirmEmail(req.query.token);

  if (result) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

exports.emailRoute = router;
