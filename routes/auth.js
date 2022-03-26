const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/User');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const jwtPrivateKey = require('../config/secrets').jwtPrivateKey

//Authenticate user
router.post('/', async (req, res) => {
    //Check if request is valid
    const {error} = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message)
    
    //check if user exists
    let user = await User.findOne({userName: req.body.name});
    if (!user) return res.status(400).json({Error: "Invalid username"})
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');
    
    //Return user 
    let payload = _.pick(user, ['_id', 'userName', 'ou', 'division', 'role'])
    const token = jwt.sign(JSON.stringify(payload), jwtPrivateKey, {algorithm: 'HS256'});
    //console.log(token);
    payload['token'] = token
    //res.header('x-auth-token', token).json(payload);
    res.json(payload)
})


module.exports = router;