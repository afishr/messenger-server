const express = require('express');
const db = require('./db');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send(process.env.NODE_ENV);
});
