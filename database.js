const mongoose = require('mongoose');
const DATABASE_CONNECTION = 'mongodb://localhost/test';

var Schema = mongoose.Schema({
    name: String
})

UserData = exports.UserData = mongoose.model('UserData', Schema);

exports.initializeMongo = () => {
    mongoose.connect(DATABASE_CONNECTION);
    console.log('Trying to connect' + DATABASE_CONNECTION);

    var db = mongoose.connection;
    db.on('error', console.log.bind(console, 'connection error: We might not be as connected as I thought'));
    db.once('open', () => {
        console.log('We are connected');
        addRandomUser();
    })
}

var addRandomUser = () => {
    var user = new UserData({
        name: "Ion" + Math.random()
    });

    user.save( (err, random ) => {
        if (err) return console.error(err);
        console.log('There is a user in the database');
    })
}