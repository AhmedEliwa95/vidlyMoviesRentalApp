const winston = require('winston');

const err = function(err,req,res,next){
    winston.error(err.messagge,err)
    res.status(500).send('Something failed internal in the server.com');

};  
// const MidErr = (err, req, res, next) => {
//     if (err.message === 'access denied') {
//       res.status(403);
//       res.json({ error: err.message });
//     }
   
//     next(err);
//   };
module.exports.err = err;