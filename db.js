const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017";

const connectToMongo = () => {
    mongoose.connect(mongoURI, { dbName: 'jeeCompanion' }, () => {
        console.log("Connected To Mongo Successfully!!");
    })
}

module.exports = connectToMongo;