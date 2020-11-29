const express = require('express');

const app = express();

const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello world!');
});
