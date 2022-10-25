const mongoose = require("mongoose");
require('dotenv').config();
const connectionParams = {
    useNewUrlParser : true,
    useUnifiedTopology : true
}

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rkzon.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
const connexion = mongoose.connect(uri, connectionParams).then(()=>{
    console.log('connected');
}).catch((err)=> console.log(err));

module.exports = connexion;