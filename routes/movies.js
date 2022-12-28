const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const {validateMovie,Movie} = require('../models/movie')
const {Genre} = require('../models/genre')
const express= require('express');
const router = express.Router();

router.use(express.json());

router.get('/',async(req,res)=>{
    const movies = await Movie.find().sort('name');
    res.send(movies)
});

router.post('/',auth,async(req,res)=>{
    const {error} = validateMovie(req.body);
    if(error) return  res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Invalid Genre')

    const  movie = new Movie({
        title:req.body.title,
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
        genre:{
            _id : genre._id,
            name: genre.name
        }
    })
    await movie.save();

    res.send(movie)
});

router.put('/:id' , auth ,async(req,res)=>{
    const {error} = validateMovie(req.body);
    if(error) res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) res.status(404).send('Invalid Genre');

    const movie = await Movie.findByIdAndUpdate(req.params.id,{
        title:req.body.title,
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
        genre:{
            _id:genre._id,
            name:genre.name
        }
    } , {new : true});
    if(!movie) res.status(404).send('No Movies by this given ID');

    res.send(movie);
});

router.delete('/:id',async(req,res)=>{
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) res.status(404).send('no movies by given ID');
    res.send(movie)
});

router.get('/:id',async(req,res)=>{
    const movie = await Movie.findById(req.params.id);
    if(!movie) res.status(404).send('no movies by given ID');
    res.send(movie)
});

module.exports = router;
