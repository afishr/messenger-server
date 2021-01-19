const mongoose = require('mongoose');

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
};

const password = 'qCuhasgt1PXQLYAz'
const dbname = 'messenger'

const url = `mongodb+srv://master:${password}@cluster0.906uy.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(url, options)
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.log(err);
  });
