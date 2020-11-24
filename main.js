const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');

const app = express();
require('dotenv').config();

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
  console.log('Listening on port ', 3000);
})

// app.get('/', (req, res) => {
// 	res.send('ggg');
// });

app.get('/', (req, res) => {
  database.UserData.find((err, users)=> {
    if (err) return res.error(err);
    console.log(users);
    res.json(users);
  })
})