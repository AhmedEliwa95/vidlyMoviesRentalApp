const mongoose = require('mongoose');
const joi = require('joi');
const { string } = require('joi');
const {genreSchema} = require('../models/genre');



const Movie = mongoose.model('Movie',new mongoose.Schema({
    title:{type:String,
        required:true,
        trim:true,
        maxlength:255,
        minlength:5,
    },
    numberInStock:{
        type:Number,
        required:true,
        min:0,
        max:255
    },
    dailyRentalRate:{
        type:Number,
        required:true,
        min:0,
        max:255      
    },
    genre:{
        type:genreSchema,
        required:true
    }
}))
function validateMovie(any){
    const schema = joi.object({
        title:joi.string().required().min(5).max(255).trim(),
        numberInStock:joi.number().required().min(0).max(255),
        dailyRentalRate:joi.number().required().min(0).max(255),
        genreId:joi.string().required()
    })
    return schema.validate(any)
} 

exports.Movie = Movie;
exports.validateMovie = validateMovie;