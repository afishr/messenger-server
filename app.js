const express = require('express');
const bodyParser = require('body-parser');
const { usersRoute } = require('./routes/users.route');
require('./db');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/users', usersRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
