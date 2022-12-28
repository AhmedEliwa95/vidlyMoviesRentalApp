const mongoose = require('mongoose');
const joi = require('joi');
const moment = require('moment');
// joi.objectId = require('joi-objectid')(joi)
const router = require('../routes/rentals');
const joiObjectid = require('joi-objectid');
// const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
    customer:{
        type:new mongoose.Schema({
            isGold:{
                default:false,
                type:Boolean
            },
            name:{
                type:String,
                required:true,
                minlength:5,
                maxlength:50
            },
            phone:{
                type:String,
                required:true,
                minlength:5,
                maxlength:50        
            }
        }),
        required:true
    },
    movie:{
        type: new mongoose.Schema({
            title:{type:String,
                required:true,
                trim:true,
                maxlength:255,
                minlength:5,
            },
            dailyRentalRate:{
                type:Number,
                required:true,
                min:0,
                max:255      
            },
        }),
        required:true
    },
    dateOut:{
        type:Date,
        default:Date.now,
        required:true
    },
    dateReturned:{
        type:Date
    },
    rentalFee:{
        type:Number,
        min:0 
    }
});
//// Static Method because it's care for the class it self 
rentalSchema.statics.lookup = function(customerId,movieId){
        return this.findOne({
        'customer._id':customerId,
        'movie._id':movieId
        });
}
/// instance method should be available on rental object 
rentalSchema.methods.return = function(){
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut,'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental',rentalSchema);


function validateRental(any){
    const schema = joi.object({
        customerId:joi.string().hex().length(24).required(),
        movieId:joi.string().hex().length(24).required()    
    });
    return schema.validate(any)
};
exports.validateRental= validateRental;
exports.Rental = Rental