const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../uploads/files")
const auth = require("../middlewares/auth");
const BookReviewSchema = require("../models/bookreview.model");



router.post("/post", auth.verifyUser, async(req, res) => {
    console.log("hitted")

   try{ const post = new BookReviewSchema({ bookId: req.body.bookId, userId: req.userInfo._id, comment: req.body.comment, name:req.body.name })
    post.save()
    res.json({success:true, message:"Review Posted."})
    }
    catch{(err)=>{
        res.json({success:false, message:err})
    }
 }
   
});

router.get("/review/:bookId", async(req, res) => {
    console.log("hitted")
   try{ 
    BookReviewSchema.find({ bookId: req.params.bookId }).then(docs=>{
        res.json({success:true, data:docs})

    }).catch((err)=>{
        res.json({success:false, message:err})
        
    })
    }
    catch{(err)=>{
        res.json({success:false, message:err})
    }
 }
   
});


module.exports = router;
