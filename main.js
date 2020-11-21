const express = require('express');
const bodyParser = require('body-parser');
const { getConnection } = require('typeorm');

const app = express();
require('dotenv').config();

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
  console.log('Listening on port ', 3000);
})

app.get('/', (req, res) => {
	res.json(getConnection().getRepository(User).find());
});