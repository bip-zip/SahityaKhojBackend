const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../uploads/files")
const auth = require("../middlewares/auth");
const AdsSchema = require("../models/ads.model");


// get ads
router.get("/", (req, res) => {
    AdsSchema.find().sort([['createdDate', -1]]).then((docs) => {
            res.json({ 'data': docs,'status': true  })
     
    }).catch(e => {
        res.json({ 'msg': 'Error', 'status': false })
    })
});

// get verified ads
router.get("/verified-ads", (req, res) => {
    AdsSchema.find({approved:true}).sort([['createdDate', -1]]).then((docs) => {
            res.json({ 'data': docs,'status': true  })
     
    }).catch(e => {
        res.json({ 'msg': 'Error', 'status': false })
    })
});


// post book publication
router.post("/add", auth.verifyUser, upload.single('picture'), (req, res) => {
    var picture = ''
    if (req.file == undefined) {
        picture = 'no.jpg'

    } else {
        picture = req.file.filename;
    }

    const user = req.userInfo._id;
    const title = req.body.title;
    const content = req.body.content;
    const link = req.body.link;
    const ad = new AdsSchema({
        requestedBy: user,
        title: title,
        content: content,
        picture: picture,
        link: link,

    });
    ad.save((err, doc) => {
        if (!err) {
            res.json({ message: "Sucessful", status: true })
        }
        else {
            res.json({ message: err, status: false })

        }
    });


})

// Ads verify
router.put("/verify", auth.verifyAdmin, (req, res) => {
    const adId = req.body.adsId;
    const approved = req.body.approved
    console.log(approved)

    AdsSchema.updateOne({ _id: adId }, {
        approved: approved
    }).then((docs) => {
       
        res.json({ "message": "Success!", status: true })
    }).catch((e) => {

        res.json({ "message": "Went wrong!", status: false })
    })

})








module.exports = router;
