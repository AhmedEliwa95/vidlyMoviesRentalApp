const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
module.exports = function(){
    mongoose.connect(config.get('db') , { useUnifiedTopology: true })
    .then(()=>winston.info(`connected  to ${config.get('db')} database`));
}