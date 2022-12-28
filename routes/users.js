const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User,validateUser} = require('../models/user');
const express = require('express');
const { use } = require('./genres');
const router = express.Router();

router.use(express.json());

router.get('/me',auth ,async (req,res)=>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user); 
});
/// Registering \\\\
router.post('/',async(req,res)=>{
    /// check the validation of the JSON body
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    /// check if this user have been already registered
    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send('This User Already Registered');

    /// if not registered then create on and pick the properties from the JSON body
    user = new User(_.pick(req.body,['name','password','email']));
    /// then we will hash the password but before hashin we have to generate a salt
    const salt = await bcrypt.genSalt(10);
    /// after generating a salt we will hash it and add the salt to it 
    user.password = await bcrypt.hash(user.password,salt);
    /// then we will save it to database
    await user.save();

    /// we will create a JWT and push it to the header snd send the main properties to the body of the response
    const token = user.generateAuthToken()
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']))
});

module.exports = router;


