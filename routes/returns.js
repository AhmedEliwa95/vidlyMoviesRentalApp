const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const {Rental} = require('../models/rental');
const validate = require('../middleware/validate')
const auth = require('../middleware/auth');
const express = require('express');
const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi);
const router = express.Router();
router.use(express.json());




router.post('/',[auth,validate(validateReturns)],async(req,res)=>{

    const rental = await Rental.lookup(req.body.customerId,req.body.movieId)


    if(!rental) return res.status(404).send('rental not found ');
  
    if(rental.dateReturned) return res.status(400).send('rental Have Been processed');

    rental.return()
    await rental.save()


    await Movie.updateOne({_id:rental.movie._id},{
        $inc:{numberInStock : 1}
    });

    return res.send(rental);

})

function validateReturns(req){
    const schema = Joi.object({
        customerId:Joi.string().hex().length(24).required(),
        movieId:Joi.string().hex().length(24).required()   
        // customerId:Joi.objectId(),
        // movieId:Joi.objectId() 
    });
    return schema.validate(req)
};

module.exports = router;