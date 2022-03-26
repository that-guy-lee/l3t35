const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/User');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const jwtPrivateKey = require('../config/secrets').jwtPrivateKey

//get list of users where the OU and division is the same as the user's
//This end point works for any role
router.get('/', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]
    try {
        const payload = jwt.verify(token, jwtPrivateKey)
        const ou = payload.ou;
        const division = payload.division;
        const users = await User.find({ou, division});
        res.json(users);
    }catch (err) {
        res.status(401).json({Error: "The given token is not valid"});
    }
});

//Get user by id. Display only if the user is from the same ou and division
//This end point works for any role
router.get('/:id', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]
    try {
        const payload = jwt.verify(token, jwtPrivateKey);
        //console.log(payload);
        const id = req.params.id;
        const user = await User.findById(id);
        if (payload.ou === user.ou && payload.division === user.division) {
            res.json(user);
        } else {
            res.status(403).json({Error: "User not authorised"});
        }
    }catch (err) {
        res.status(401).json({Error: "The given token is not valid"});
    }
});

//Register a new user
//This end point works for any role
//Note: to use this endpoint the user must already be authenticated.
//This endpoint does not return a token for the newly created user
//To get a token for the newly created user, use the auth endpoint with the new user credentials
router.post('/', async (req, res) => {
    //Authenticate user
    const token = req.headers['authorization'].split(' ')[1]
    //console.log(token);
    try {
        console.log(token);
        console.log("Made it to here");
        let payload = jwt.verify(token, jwtPrivateKey);
        const ou = payload.ou;
        const division = payload.division;

        //Check if request is valid
        const {error} = validate(req.body);
        if (error) return res.status(400).json(error.details[0].message);
        
        //check if user exists
        let user = await User.findOne({userName: req.body.name});
        if (user) return res.status(400).json({Error: "This username is taken"});
        
        //Add user
        user = new User({
            userName: req.body.name,
            password: req.body.password,
            ou: req.body.ou,
            division: req.body.division
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
     
        //Return user 
        payload = _.pick(user, ['_id', 'userName', 'ou', 'division', 'role']);
        res.json(payload);
    } catch (err) {
        res.status(401).json({Error: "The given token is not valid"});
    }
})

//Update user details
//To update username or password requires Management role
//To update ou, division or role requires Admin role
router.put('/', async (req, res) => {
    //Authenticate user
    const token = req.headers['authorization'].split(' ')[1]
    try {
        //verify token
        let payload = jwt.verify(token, jwtPrivateKey);

        //extract payload (contains data for authenticated user)
        const ou = payload.ou;
        const division = payload.division;
        const role = payload.role;

        //Check user is from the correct ou and division
        if (!req.body.ou) res.status(400).json({Error: "User OU is not specified"});
        if (!req.body.division) res.status(400).json({Error: "User Division is not specified"});
        if (ou !== req.body.ou || division !== req.body.division) {
            return res.status(400).json({Error: "User is authenticated but is from a different OU or Division. Must be from the same OU or Division"});
        }
        //Check which field must be updated
        const fieldToBeUpdated = req.body.fieldToBeUpdated;
        if (!fieldToBeUpdated) return res.status(400).json({Error: "Please specify which field must be updated"})
        else {
            if (fieldToBeUpdated === "userName" || fieldToBeUpdated === "password") {
                if (role !== "Management" && role !== "Admin") return res.status(403).json({Error: "Requires Management or Admin role to change this field"});
                if (fieldToBeUpdated === "userName") {
                    //Check body is valid
                    validateSingleItem(req.body.oldName, 400, "Please specify old username", res);
                    validateSingleItem(req.body.newName, 400, "Please specify new username", res);

                    //update username
                    let user = await findAndUpdate({userName: req.body.oldName}, {userName: req.body.newName}, res);
                    
                    returnToClient(user, res);
                }
                if (fieldToBeUpdated === "password") {
                    //Check body is valid
                    validateSingleItem(req.body.name, 400, "Please specify username", res);
                    validateSingleItem(req.body.newPassword, 400, "Please specify new password", res);
                    
                    //update password
                    const password = await encryptPassword(req.body.newPassword)
                    
                    //Update user
                    let user = await findAndUpdate({userName: req.body.name}, {password: password}, res);
                    
                    returnToClient(user, res);
                }
            }
            else if (fieldToBeUpdated === "ou" || fieldToBeUpdated === "division" || fieldToBeUpdated === "role") {
                if (role !== "Admin") return res.status(403).json({Error: "Requires Admin role to change this field"})
                if (fieldToBeUpdated === "ou") {
                    //Check body is valid
                    validateSingleItem(req.body.name, 400, "Please specify username", res);
                    validateSingleItem(req.body.newOu, 400, "Please specify new OU", res);
                    
                    //update ou
                    let user = await findAndUpdate({userName: req.body.name}, {ou: req.body.newOu}, res);
                    
                    returnToClient(user, res);
                }
                if (fieldToBeUpdated === "division") {
                    //Check body is valid
                    validateSingleItem(req.body.name, 400, "Please specify username", res);
                    validateSingleItem(req.body.division, 400, "Please specify old Division", res);
                    validateSingleItem(req.body.newDivision, 400, "Please specify new Division", res);
                    
                    //update division
                    let user = await findAndUpdate({userName: req.body.name}, {division: req.body.newDivision}, res);
                    
                    returnToClient(user, res);
                }
                if (fieldToBeUpdated === "role") {
                    //Check body is valid
                    validateSingleItem(req.body.name, 400, "Please specify username", res);
                    validateSingleItem(req.body.newRole, 400, "Please specify new Role", res);

                    //update role
                    let user = await findAndUpdate({userName: req.body.name}, {role: req.body.newRole}, res);
                    
                    returnToClient(user, res);
                }
            } else return res.status(400).json({Error: "Value for field to be updated is invalid"})
        }
    }
    catch (err) {
        res.status(401).json({Error: "The given token is not valid"});
    }
});

module.exports = router;

//Return response to client
function returnToClient(user, res) {
    const newUser = _.pick(user, ['_id', 'userName', 'ou', 'division', 'role']);
    res.json(newUser);
}

//Validate a single item in the request body
function validateSingleItem(item, errorCode, message, res) {
    if (!item) return  res.status(errorCode).json({Error: message});
}

//Encrypt the password
async function encryptPassword(plainTextPassword) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainTextPassword, salt);
}

//Find document and update or send back 404 if not found
async function findAndUpdate(searchObj, changeObj, res) {
    let user = await User.findOneAndUpdate(searchObj, changeObj, {new: true});
    if (!user) return res.status(404).send("The user with the given username was not found");
    else return user;
}