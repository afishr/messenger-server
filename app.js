const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { authRoute } = require('./routes/auth.route');
const { userRoute } = require('./routes/user.route');
const { chatRoute } = require('./routes/chat.route');
const { errorHandler } = require('./common/error.handling/error.handler');
const { formatMessage, getChat, addMessage } = require('./services/chats.service');
const { getUserId, findUserById } = require('./services/users.service');
const { logger } = require('./log/log');
const httpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});

const socketLimiter = new RateLimiterMemory(
  {
    points: 10,
    duration: 1,
  },
);

require('dotenv').config();
require('./db');

const app = express();
app.use(morgan('common'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(httpLimiter);
app.use(cors());
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/chats', chatRoute);
app.use(errorHandler);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

const io = socketio(server);

io.on('connection', (socket) => {
  socket.on('disconnectMe', ({ chatId }) => {
    logger.info(`Chat ${chatId} disconnected`);
    socket.leave(chatId);
  });

  socket.on('chatMessage', async ({ msg, token, chatId }) => {
    try {
      await socketLimiter.consume(socket.handshake.address);
      if (chatId) {
        logger.info(`new message in ${chatId}`);
        const time = new Date().getTime();
        const userId = getUserId(token);
        const user = await findUserById(userId);
        await addMessage(user, chatId, msg, time);
        io.to(chatId).emit('message', formatMessage(user.username, msg, time));
      }
    } catch (rejRes) {
      io.to(chatId).emit('blocked', { 'retry-ms': rejRes.msBeforeNext });
    }
  });

  socket.on('joinRoom', async ({ token, to }) => {
    try {
      await socketLimiter.consume(socket.handshake.address);

      const userId = getUserId(token);
      if (userId) {
        const chatId = await getChat(userId, to);
        socket.join(chatId);
        logger.info(`User ${userId} connected to ${chatId}`);
        socket.emit('chatId', chatId);
      }
    } catch (rejRes) {
      socket.emit('blocked', { 'retry-ms': rejRes.msBeforeNext });
    }
  });
});
