const winston = require('winston')
const express = require('express');
const genres = require('../routes/genres');
const err = require('../middleware/error');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users')
const auth = require('../routes/auth');
const returns = require('../routes/returns')

module.exports = function(app){

    app.use(express.json());
    app.use('/api/genres',genres);
    app.use('/api/customers',customers);
    app.use('/api/movies',movies);
    app.use('/api/rentals',rentals);
    app.use('/api/users',users);
    app.use('/api/auth',auth);
    app.use('/api/returns',returns);

    // app.use(err)
    // because of error app.use():requires a middleware function we will apply it here 
    app.use(function(err,req,res,next){
        winston.error(err.message,err)
        res.status(500).send('Something failed internal in the server');

    });
};
// function(err,req,res,next){
//     winston.error(err.message,err)
//     res.status(500).send('Something failed internal in the server');

// });