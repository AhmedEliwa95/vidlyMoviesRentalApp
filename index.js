const winston = require('winston');
const express = require('express');
const { string, custom } = require('joi');
const app = express();

/// these are functions exported from other modules and we now call it except logging
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app)





const port = process.env.PORT || 3000;
const server = app.listen(port,()=>winston.info(`listenning to portNum: ${port}`));
module.exports = server;
// console.log(process.env)
// console.log(process.env.NODE_ENV)
