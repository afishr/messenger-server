const express = require('express');
const { authGuard } = require('../middlewares/auth.middleware');
const { getMessages } = require('../services/chats.service');

const router = express.Router();

router.get('/:chatId', authGuard, (req, res) => {
  getMessages(null, req.params.chatId)
    .then((messages) => res.send(messages));
});

exports.chatRoute = router;
