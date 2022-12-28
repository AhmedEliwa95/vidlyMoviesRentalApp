const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const passwordComplixity = require('joi-password-complexity')
const { string } = require('joi');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:5,
        maxlength:255
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        maxlength:1024
    },
    isAdmin:{
        type:Boolean
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign( {_id:this._id , isAdmin:this.isAdmin} , config.get('jwtPrivateKey'));
    return token;
} 

const User = mongoose.model('User',userSchema);

function validateUser(any){
    const schema = joi.object({
        name:joi.string().required().min(5).max(255),
        email:joi.string().required().min(5).max(255).email(),
        // password:joi.string().required().min(8).max(255)
        password:passwordComplixity(),
        isAdmin:joi.boolean()
        
    });
    return schema.validate(any)
};


module.exports.validateUser = validateUser;
module.exports.User = User;