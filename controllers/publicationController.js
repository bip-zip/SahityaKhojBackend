const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const PublicationSchema = require("../models/publication.model");
const UserSchema = require("../models/user.model");
const jwt = require("jsonwebtoken");
const upload = require("../uploads/files")
const auth = require("../middlewares/auth");



// POST request (User Registration)
router.post("/publication-request", upload.single('companyReg'), (req, res) => {
    const email = req.body.email
    var companyReg = ''
    if (req.file == undefined) {
        res.json({ "msg": "Wrong file format", status: false })

    } else {
        companyReg = req.file.filename;
    }
    PublicationSchema.findOne({
        email: email
    }).then((UserData) => {
        if (UserData != null) {
            res.json({ message: "Email already registered!", status: false })
            return;
        }

        var name = req.body.name;
        const address = req.body.address;
        const email = req.body.email;
        const contact = req.body.contact;
        const pan = req.body.pan



        const publication = new PublicationSchema({
            name: name,
            address: address,
            email: email,
            contact: contact,
            pan: pan,
            companyReg: companyReg

        });
        publication.save().then(() => {
            res.json({ message: 'Request Successful!', status: true })
        }).catch((err) => {
            res.json({ message: err, status: false })
        })


    })

})

// get publications
router.get("/", (req, res) => {
    PublicationSchema.find().sort([['requestedDate', -1]]).then((docs) => {
        res.json({ 'data': docs, 'status': true })

    }).catch(e => {
        res.json({ 'msg': 'Error', 'status': false })
    })
});


function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function registerPublication(_email) {
    const password = generatePassword()
    console.log("password is: " + password)
    const penname = _email.split("@")[0]

    UserSchema.findOne({
        email: _email
    }).then((UserData) => {
        if (UserData != null) {
            console.log("publication not registered", UserData)
            return false;
        }
        else {
            bcryptjs.hash(password, 10, (err, hashed_pw) => {
                
                const user = new UserSchema({
                    penname: penname,
                    password: hashed_pw,
                    email: _email,
                    isPublisher: true
                });
                user.save()
                console.log("publication registered")
            })
            return true

        }
    })




}


// publication verify
router.put("/verify", auth.verifyAdmin, (req, res) => {
    const pubId = req.body.pubid;
    const email = req.body.email
    const approved = req.body.approved
    console.log(approved)

    PublicationSchema.updateOne({ _id: pubId }, {
        verified: approved
    }).then((docs) => {
        if(approved){
            registerPublication(email)
        res.json({ "message": "Success!", status: true })



        }
        else{
            UserSchema.deleteOne({email:email}).then((docs)=>{
                res.json({ "message": "Success!", status: true })
            })



        }

        
    }).catch((e) => {

        res.json({ "message": "Went wrong!", status: false })
    })

})

//verify get publications

router.get("/verified", (req, res) => {

    PublicationSchema.find({'verified':true})

    .sort([['requestedDate', -1]])

    .then((docs) => {

        res.json({ 'data': docs, 'status': true })



    }).catch(e => {

        res.json({ 'msg': 'Error', 'status': false })

    })

});
module.exports = router;