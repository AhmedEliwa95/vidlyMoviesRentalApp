const mongoose = require('mongoose');
const express = require('express');
const {Customer,validateCustomers} = require('../models/customer')
const { required, boolean } = require('joi');
const { application } = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(express.json());





router.get('/',async (req,res)=>{
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/',auth,async(req,res)=>{
    const {error} = validateCustomers(req.body);
    if(error)res.status(400).send(error.details[0].message);

    let  customer = new Customer({
        name:req.body.name,
        isGold:req.body.isGold,
        phone:req.body.phone
    });

    customer = await customer.save();
    res.send(customer);
})
router.put('/:id',async(req,res)=>{
    const {error} = validateCustomers(req.body);
    if(error) res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {name:req.body.name,
        phone:req.body.phone,
        isGold:req.body.isGold },
        {new:true});
    if(!customer) res.status(404).send('No customer by this ID');
   

    res.send(customer);
})
router.get('/:id',async(req,res)=>{
    const customer = await Customer.findById(req.params.id);
    if(!customer) res.status(404).send('No Customer by this given ID');
    res.send(customer)
})
router.delete('/:id',async(req,res)=>{
    const customer =await Customer.findByIdAndRemove(req.params.id);
    if(!customer) res.status(404).send('No Customer by this ID');
    res.send(customer)
});



module.exports = router