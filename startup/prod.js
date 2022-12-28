const helmet = require('helmet');
const compresiion = require('compression');

module.exports = function(app){
    app.use(helmet());
    app.use(compresiion()); 
}