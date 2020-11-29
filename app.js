const express = require('express');
const db = require('./db');
const users = require('./routes/users');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));

app.use('/users', users);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
