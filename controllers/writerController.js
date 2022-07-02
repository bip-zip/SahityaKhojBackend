const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const WriterSchema = require("../models/writer.model");
const UserSchema = require("../models/user.model");
const jwt = require("jsonwebtoken");
const upload = require("../uploads/files")
const auth = require("../middlewares/auth");



// POST request (User Registration)
router.post("/writer-request", auth.verifyUser, upload.single('citizenship'), (req, res) => {
    const userId = req.userInfo._id
    var citizenship = ''
    if (req.file == undefined) {
        res.json({ "msg": "Wrong file format", status: false })
    } else {
        citizenship = req.file.filename;
    }
    WriterSchema.findOne({
        requestedBy: userId
    }).then((UserData) => {
        if (UserData != null) {
            res.json({ message: "Request is already on pending!", status: false })
            return;
        }

        var name = req.body.name;
        const bookName = req.body.bookName;
        const bookPublisher = req.body.bookPublisher;
        

        const writer = new WriterSchema({
            name: name,
            bookName: bookName,
            bookPublisher: bookPublisher,
            citizenship: citizenship,
            requestedBy:userId

        });
        writer.save().then(() => {
            // const namearr = name.split(" ")
            // saveName(userId,namearr[0],namearr[namearr.length-1])
            res.json({ message: 'Request submitted successfully!', status: true })
        }).catch((err) => {
            res.json({ message: err, status: false })
        })


    })

})

// get writers request
router.get("/", (req, res) => {
    WriterSchema.find().sort([['requestedDate', -1]]).then((docs) => {
        res.json({ 'data': docs, 'status': true })

    }).catch(e => {
        res.json({ 'msg': 'Error', 'status': false })
    })
});


function isWriterApprove(user, approved){
    UserSchema.updateOne({ _id: user }, {
        isWriter: approved
        
    }).then(()=>{
        return true
    })

}


// writer verify
router.put("/verify", auth.verifyAdmin, (req, res) => {
    const user = req.body.userId;
    const approved = req.body.approved
    console.log(approved)

    WriterSchema.updateOne({ requestedBy: user }, {
        verified: approved
    }).then((docs) => {
        isWriterApprove(user, approved)

        res.json({ "message": "Success!", status: true })
       
    }).catch((e) => {
        res.json({ "message": "Went wrong!", status: false })
    })

})


router.get("/info", auth.verifyUser, (req, res) => {
    console.log("I got it")
    WriterSchema.findOne({
        requestedBy: req.userInfo._id
    }).then((docs) => {
            // console.log('followers, following', docs.followers.length)
            // console.log('here it is ', docs.profileVisit)
            profileVisitInc(req.userInfo._id,docs.profileVisit);

            res.json({ 'data': docs,  success: true })

        }).catch(e => {
            res.json({ 'message': 'Error', success: false })

        })
})

function profileVisitInc(uid,pv){

    WriterSchema.updateOne({requestedBy:uid},{
        profileVisit:pv+1
    }).then(e=>{
        return true
    }).catch(e=>{
        return false
    })

}

function profileSync(user, pp){
    UserSchema.updateOne({ _id: user }, {
        profilePic: pp
        
    }).then(()=>{
        return true
    })

}

// update writer details
router.put('/update', upload.single('profilePic'), auth.verifyUser, (req, res) => {

    if (req.file == undefined) {
        const user = req.userInfo._id;
        const contact = req.body.contact;
        const penname = req.body.penname;
        const email = req.body.email;
        const education = req.body.education;
        const birthPlace = req.body.birthPlace;
        const dob = req.body.dob;
        

        WriterSchema.updateOne({ requestedBy: user }, { penname: penname, contact: contact, email: email, education:education, birthPlace:birthPlace, dob:dob }).then(result => {
            res.json({ "message": "Update Successful!", status: true })
        }).catch(e => {

            res.json({ "message": "Update error!", status: false })
        })
    }
    else {
        const user = req.userInfo._id;
        const contact = req.body.contact;
        const penname = req.body.penname;
        const email = req.body.email;
        const education = req.body.education;
        const birthPlace = req.body.birthPlace;
        const dob = req.body.dob;
        const profilePic = req.file.filename
        WriterSchema.updateOne({ requestedBy: user }, { penname: penname, contact: contact, email: email, education:education, birthPlace:birthPlace, dob:dob, profilePic:profilePic }).then(result => {
            //    console.log("picuploaded")
            profileSync(user,profilePic)
            res.json({ "message": "Update Successful!", success: true })
        }).catch(e => {
            res.json({ "message": "Update error!", success: false })
        })

    }


})



router.get("/trending",  (req, res) => {

    console.log("I got it")

    WriterSchema.find({"verified":true})

    .sort({'profileVisit':-1})

    .limit(9)

    .then((docs) => {

            res.json({ 'data': docs })

    }).catch(e => {

        res.json({ 'msg': 'Error', 'success': false })

    })

})



module.exports = router;