/* eslint-disable consistent-return */
/* eslint-disable no-console */
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');
const { authRoute } = require('./routes/auth.route');
const { userRoute } = require('./routes/user.route');
const { chatRoute } = require('./routes/chat.route');
const { errorHandler } = require('./common/error.handling/error.handler');

const { formatMessage, getChat, addMessage } = require('./services/chats.service');
const { getUserId, findUserById } = require('./services/users.service');

require('dotenv').config();
require('./db');

const app = express();
app.use(morgan('common'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors({
//   origin: 'http://localhost:3000',
// }));

app.use(cors());
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/chats', chatRoute);
app.use(errorHandler);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const io = socketio(server);

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    host: 'http://localhost:9200',
    log: 'info',
  },
  transformer: (logData) => ({
    '@timestamp': (new Date()).getTime(),
    severity: logData.level,
    message: `[${logData.level}] LOG Message: ${logData.message}`,
    fields: {},
  }),
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logfile.log', level: 'error' }), // save errors on file
    new Elasticsearch(esTransportOpts), // everything info and above goes to elastic
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ // we also log to console if we're not in production
    format: winston.format.simple(),
  }));
}

io.on('connection', (socket) => {
  socket.on('disconnectMe', ({ chatId }) => {
    console.log('i disconneced');
    socket.leave(chatId);
  });

  socket.on('chatMessage', async ({ msg, token, chatId }) => {
    try {
      if (chatId) {
        console.log('i `have a new message', msg, chatId);
        const time = new Date().getTime();
        const userId = getUserId(token);
        const user = await findUserById(userId);
        await addMessage(user, chatId, msg, time);
        io.to(chatId).emit('message', formatMessage(user.username, msg, time));
      }
    } catch (e) { console.log('here'); }
  });

  socket.on('joinRoom', async ({ token, to }) => {
    try {
      const userId = getUserId(token);
      if (userId) {
        const chatId = await getChat(userId, to);
        socket.join(chatId);
        console.log(`User ${userId} connected to ${chatId}`);
        socket.emit('chatId', chatId);
      }
    } catch (e) { return 1; }
  });
});
