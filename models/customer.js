const joi = require('joi');
const mongoose = require('mongoose');


const Customer = mongoose.model('Coustmer',new mongoose.Schema({
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
}));

function validateCustomers (any){
    const schema = joi.object({
        name:joi.string().required().min(5).max(50),
        phone:joi.string().required().min(5).max(50),
        isGold:joi.boolean(),
        
    })
    return schema.validate(any)
}

exports.Customer = Customer;
exports.validateCustomers = validateCustomers;