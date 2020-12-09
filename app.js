const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { authRoute } = require('./routes/auth.route');
const { authGuard } = require('./middlewares/auth.middleware');
const { formatMessage, getChat, addMessage } = require('./services/chats.service');
const { getUserId, findUserById } = require('./services/users.service');
require('dotenv').config();
require('./db');

const app = express();
app.use(morgan('common'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use('/auth', authRoute);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/me', authGuard, (req, res) => {
  res.send(req.user);
});

app.get('/', (req, res) => {
  res.json({
    message: 'I am useful',
  });
});

const io = socketio(server);

io.on('connection', (socket) => {
  socket.on('disconnectMe', ({ chatId }) => {
    console.log('diconnect');
    socket.leave(chatId);
  });

  socket.on('chatMessage', async ({ msg, token, chatId }) => {
    console.log('i `have a new message', msg, chatId);
    const time = new Date().getTime();
    const userId = getUserId(token);
    const user = await findUserById(userId);
    await addMessage(user, chatId, msg, time);
    io.to(chatId).emit('message', formatMessage(user.username, msg, time));
  });

  socket.on('joinRoom', async ({ token, to }) => {
    const userId = getUserId(token);
    if (userId) {
      const chatId = await getChat(userId, to);
      socket.join(chatId);
      console.log(`User ${userId} connected to ${chatId}`);
      socket.emit('chatId', chatId);
    }
  });
});
