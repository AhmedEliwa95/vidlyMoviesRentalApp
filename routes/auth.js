
const mongoose = require('mongoose');
const joi = require('joi');
// const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const express = require('express');
const { use } = require('./genres');
const router = express.Router();

router.use(express.json());

/// Logging in or authentication

router.post('/',async(req,res)=>{
    ///1- check the validatin of the email and the password
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //2-check the validation of the email
    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Invalid Email or Password');

    //3-check  the validayion of the password
    const validPassword = await bcrypt.compare(req.body.password , user.password);
    if(!validPassword) return res.status(400).send('Invalid Email or Password')

    //4- create a token and send it to the body of the response
    const token = user.generateAuthToken()
    res.send(token)

});
function validate(req){
    const schema = joi.object({

        email:joi.string().required().min(5).max(255).email(),
        password:joi.string().required().min(8).max(255)
        // password:passwordComplixity()
        
    });
    return schema.validate(req)
}

module.exports = router;


