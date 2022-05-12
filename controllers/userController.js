const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const UserSchema = require("../models/user.model");
const jwt = require("jsonwebtoken");
const upload = require("../uploads/files")
const auth = require("../middlewares/auth");


// POST request (User Registration)
router.post("/user/registration", (req, res) => {
    const penname = req.body.penname
    UserSchema.findOne({
        penname: penname
    }).then((UserData) => {
        if (UserData != null) {
            res.json({ message: "Username already exist!", status: false })
            return;
        }
        // password hash
        const password = req.body.password;
        bcryptjs.hash(password, 10, (err, hashed_pw) => {
            var firstname = req.body.firstname;
            var lastname = req.body.lastname;
            // if(firstname || lastname == undefined){
            //     firstname = 'Ghumfir'
            //     lastname = 'Yatri'
            // }
            const address = req.body.address;
            const email = req.body.email;
            const contact = '+977 ';
            // const joined = req.body.joined;
            const pp = 'pp.jpg';
            const cp = 'cp.jpg';
            const bio = 'Sahitya lai khojeko maile...';
            const user = new UserSchema({
                penname: penname,
                password: hashed_pw,
                firstname: firstname,
                lastname: lastname,
                address: address,
                email: email,
                contact: contact,
                // joined: joined,
                profilePic: pp,
                coverPic: cp,
                bio:bio
            });
            console.log(user, req.body)
            user.save().then(() => {
                res.json({ message: 'Registration Complete!', status: true })
            }).catch((err) => {
                res.json({ message: err, status: false })
            })
        })
    })
})

module.exports = router;