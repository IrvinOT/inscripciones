const mongoose = require('mongoose');

const dataBaseName = 'inscriptions';
const connectionURL = process.env.CONNECTION_DB;

mongoose.connect(connectionURL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
});