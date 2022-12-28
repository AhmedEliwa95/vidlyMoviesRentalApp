const mongoose = require('mongoose');
const joi = require('joi')

const genreSchema = new mongoose.Schema({
    // _id:Number,
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    }})
const Genre = mongoose.model('Genre', genreSchema ); 

function validateGenres(any){
    const schema = joi.object({
        name:joi.string().required().min(5).max(50)
    });
    return schema.validate(any);
};

exports.Genre = Genre;
exports.validateGenres = validateGenres;
exports.genreSchema = genreSchema;