const express = require('express');
const { authGuard } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/confirm', authGuard, (req, res) => {
  res.send(req.query);
});

exports.emailRoute = router;
