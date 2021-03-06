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
const { emailRoute } = require('./routes/email.route');
const { logger } = require('./log/log');
const { initSender } = require('./services/email.service');

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

const loggerstream = {
  write(message, encoding) {
    console.log('mmmm', message);
    logger.info(message);
  },
};

function createLog(tokens, req, res) {
  const logData = {
    requestMethod: req.method,
    requestUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    protocol: `HTTP/${req.httpVersion}`,
    remoteIp: req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip,
    requestSize: req.socket.bytesRead,
    userAgent: req.get('User-Agent'),
    referrer: req.get('Referrer'),
  };
  return JSON.stringify(logData);
}

const app = express();
app.use(morgan(createLog, { stream: loggerstream }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(httpLimiter);
app.use(cors());
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/chats', chatRoute);
app.use('/email', emailRoute);
app.use(errorHandler);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  initSender(process.env.SENDGRID_KEY);
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
