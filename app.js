const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { usersRoute } = require('./routes/users.route');
const { authGuard } = require('./middlewares/auth.middleware');
const cors = require('cors')
require('./db');

const app = express();
const port = process.env.PORT || 8080;
app.use(morgan('common'))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/users', usersRoute);
app.use(cors({
  origin: 'http://localhost:3000',
}))

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/me', authGuard, (req, res) => {
  res.send(req.user);
});

app.get('/', (req, res) => {
  res.json({
    message: "I am useful"
  })
})
