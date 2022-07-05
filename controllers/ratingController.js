const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const RatingSchema = require("../models/rating.model");
const UserSchema = require("../models/user.model");
const jwt = require("jsonwebtoken");
const upload = require("../uploads/files")
const auth = require("../middlewares/auth");

//  delete feed
router.post("/rate", auth.verifyUser, async (req, res) => {
    const bookId = req.body.bookId
    const userId = req.userInfo._id
    const star = req.body.star
    console.log(req.body,userId)
    RatingSchema.find({ bookId: bookId, userId: userId }).then((data) => {
        console.log(data)
        if (data=='') {
            const rating = RatingSchema({ bookId: bookId, userId: userId, star: star })
            rating.save().then(() => {
    
                res.json({ success: true, message: "Thanks for your rating." })
            })
                .catch((err) => {
                    res.json({ message: err, success: false });
                });
        }
        else {
            RatingSchema.findOneAndUpdate({bookId: bookId, userId: userId },{star: star})
            .then(() => {
    
                res.json({ success: true, message: "Thanks for your rating." })
            })
                .catch((err) => {
                    res.json({ message: err, success: false });
                });
    
        }

      
    })
        .catch((err) => {
            res.json({ message: err, success: false });
        });
    
})





module.exports = router;
