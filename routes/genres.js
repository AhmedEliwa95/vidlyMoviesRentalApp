const { default: mongoose } = require('mongoose');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth')
const {Genre,validateGenres} = require('../models/genre')
const { application, json } = require('express');
const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
router.use(express.json());

router.get('/', async (req,res)=>{

    const genres = await  Genre.find().sort('name').select('-__v')
    res.send(genres);
});


router.post('/',auth,async (req,res)=>{
    const {error}  = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    
    const  genre = new Genre({name:req.body.name})    
      
    await genre.save();
    res.send(genre);
});
router.put('/:id',[auth , validateObjectId],async (req,res)=>{
    const { error } = validateGenres(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id,
        {name:req.body.name},
        {new:true});
    if(!genre) return res.status(404).send('no genre with gin=ven ID');

    res.send(genre);
});
router.get('/:id',validateObjectId,async (req,res)=>{

    if(!genre) return res.status(404).send('no genre with given id');

    res.send(genre)
});



router.delete('/:id',[auth,admin,validateObjectId] , async (req,res)=>{
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) return res.status(404).send('can not delete null');

    res.send(genre)
});

module.exports = router;