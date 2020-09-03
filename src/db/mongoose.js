const mongoose = require('mongoose');


const password= process.env.DB_PASSWORD;
const dataBasea = process.env.DATA_BASE;
const connectionURL = `mongodb+srv://Main:${password}@maincluster.2h0oi.mongodb.net/${dataBasea}?retryWrites=true&w=majority`;

mongoose.connect(connectionURL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
});