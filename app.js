const express = require('express');
const socketio = require('socket.io');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { usersRoute } = require('./routes/users.route');
const { authGuard } = require('./middlewares/auth.middleware');

const formatMessage = require('./utils/messages');
const {
  userJoin, getCurrentUser, userLeave, getRoomUsers,
} = require('./utils/users');

require('./db');

const app = express();
app.use(morgan('common'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/users', usersRoute);
app.use(cors({
  origin: 'http://localhost:3000',
}));

const botName = 'Chat';
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
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} left the chat`));

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  socket.on('chatMessage', (msg) => {
    console.log('i have a new message', msg);
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('joinRoom', ({ username, room }) => {
    console.log(`User ${username} joined rooms ${room}`);
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit('message', formatMessage(botName, 'Welcome to our mega secure chat'));

    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botName, `${user.username} connected`));

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});
