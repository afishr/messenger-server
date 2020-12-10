const express = require('express');
const { authGuard } = require('../middlewares/auth.middleware');
const { getMessages } = require('../services/chats.service');
const { asyncMiddleware } = require('../common/error.handling/async.middleware');

const router = express.Router();

router.get('/:chatId', authGuard, asyncMiddleware((req, res) => {
  getMessages(req.user._id, req.params.chatId)
    .then((messages) => {
      console.log(messages, typeof(messages));
      return res.send(messages);
    })
}));

exports.chatRoute = router;
