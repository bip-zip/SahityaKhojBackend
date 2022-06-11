const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../uploads/files")
const auth = require("../middlewares/auth");
const BookSchema = require("../models/book.model");



// get books
router.get("/", (req, res) => {
    BookSchema.find().sort([['createdDate', -1]]).then((docs) => {
            res.json({ 'data': docs,'status': true  })
     
    }).catch(e => {
        res.json({ 'msg': 'Error', 'status': false })
    })
});

// search books
router.get("/search/:query", (req, res) => {
    const gquery = req.params.query
    const regex = new RegExp(escapeRegex(gquery), 'gi');

    BookSchema.find({$or:[{'bookName':regex}, {'category':regex},{'bookWriter':regex},{'publication':regex},{'isbn':regex} ], $and:[{approved:true}]},(err, docs) => {
        console.log('these are the data',docs, req.params.query)
       
            res.json({ 'data': docs, success:true })
        
    // }).catch(e=>{
    //     res.json({ 'message': 'Error', success:false, query:req.params.query })

    })
});

// for search and Prevention for DDos Attack
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};





// get books by individual users
router.get("/added-books/:uid",auth.verifyUser, (req, res) => {
    const user = req.params.uid;
    BookSchema.find({requestedBy:user,approved:true}).sort([['createdDate', -1]]).then((docs) => {
            res.json({ 'data': docs })
     
    }).catch(e => {
        res.json({ 'msg': 'Error', 'success': false })
    })
});


// post book publication
router.post("/add", auth.verifyUser, upload.single('bookCover'), (req, res) => {
    // uploading bookcover
    var bookcover = ''
    if (req.file == undefined) {
        bookcover = 'no.jpg'

    } else {
        bookcover = req.file.filename;
    }

    const user = req.userInfo._id;
    const bookName = req.body.bookName;
    const bookWriter = req.body.bookWriter;
    const price = req.body.price;
    const category = req.body.category;
    const isbn = req.body.isbn;
    const publishedDate = req.body.publishedDate;
    const abstract = req.body.abstract;
    const book = new BookSchema({
        requestedBy: user,
        bookName: bookName,
        bookWriter: bookWriter,
        price: price,
        category: category,
        isbn: isbn,
        publishedDate: publishedDate,
        abstract: abstract,
        bookCover:bookcover

    });
    book.save((err, doc) => {
        if (!err) {
            res.json({ message: "Sucessful", status: true })
        }
        else {
            res.json({ message: err, status: false })

        }
    });


})

// book vefify
router.put("/verify", auth.verifyAdmin, (req, res) => {
    // uploading bookcover
    
    const bookId = req.body.bookid;
    const approved = req.body.approved
    BookSchema.updateOne({_id:bookId},{
        approved:approved

    }).then((err) => {
     
        res.json({ "message": "Update Successful!", status: true })
    }

    ).catch((e) => {

        res.json({ "message": "Went wrong!", status: false })
    })


})


// post book publication
router.post("/add-releasing", auth.verifyUser, upload.single('bookCover'), (req, res) => {
    // uploading bookcover
    var bookcover = ''
    if (req.file == undefined) {
        bookcover = 'no.jpg'

    } else {
        bookcover = req.file.filename;
    }

    const user = req.userInfo._id;
    const bookName = req.body.bookName;
    const bookWriter = req.body.bookWriter;
    const category = req.body.category;
    const releasingDate = req.body.releasingDate;
    const isReleasing= true;

    const book = new BookSchema({
        requestedBy: user,
        bookName: bookName,
        bookWriter: bookWriter,
        releasingDate: releasingDate,
        category: category,
        isReleasing: isReleasing,
        bookCover:bookcover
    });
    book.save((err, doc) => {
        if (!err) {
            res.json({ message: "Sucessful", status: true })
        }
        else {
            res.json({ message: err, status: false })

        }
    });
})

// feeds of release user
router.get("/ind-release/:uid",auth.verifyUser, (req, res) => {
    const _user = req.params.uid;
    BookSchema.find({requestedBy:_user, isReleasing:true})
        .populate("requestedBy", "_id penname firstname lastname profilePic")
        .populate("Comments.PostedBy", "_id firstname lastname profilePic")
        .sort([['date', -1]])
        .then((docs) => {
            let release = [];
            docs.map((item) => {
                release.push({
                    _id: item._id,
                    bookName: item.bookName,
                    bookWriter: item.bookWriter,
                    category: item.category,
                    releasingDate: item.releasingDate,
                    bookCover: item.bookCover,
                    Shares: item.Shares,
                    Likes: item.Likes,
                    Comments: item.Comments,
                    user:item.requestedBy
                });
            });

            res.json({ 'data': release, 'success': true })
        }).catch(e => {
            res.json({ 'msg': 'Error', 'success': false })
        })
});

// feeds of release user
router.get("/releases", (req, res) => {
    BookSchema.find({isReleasing:true})
        .populate("requestedBy", "_id penname firstname lastname profilePic")
        .populate("Comments.PostedBy", "_id firstname lastname profilePic")
        .sort([['date', -1]])
        .then((docs) => {
            let release = [];
            docs.map((item) => {
                release.push({
                    _id: item._id,
                    bookName: item.bookName,
                    bookWriter: item.bookWriter,
                    category: item.category,
                    releasingDate: item.releasingDate,
                    bookCover: item.bookCover,
                    Shares: item.Shares,
                    Likes: item.Likes,
                    Comments: item.Comments,
                    user:item.requestedBy
                });
            });

            res.json({ 'data': release, 'success': true })
        }).catch(e => {
            res.json({ 'msg': 'Error', 'success': false })
        })
});

// like release

router.put('/release/like', auth.verifyUser, (req, res) => {



    BookSchema.findByIdAndUpdate(

        req.body.bookId,

        {

            $push: { Likes: req.userInfo._id },

        },

        { new: true }

    )

        .then((docs, err) => {

            console.log('liked')

            res.json({ message: 'Success', success: true, likecount: docs.Likes.length });

        }).catch(e => {

            res.json({ error: err, success: false });

        });



})




// unlike release

router.put('/release/unlike', auth.verifyUser, (req, res) => {



    BookSchema.findByIdAndUpdate(

        req.body.bookId,

        {

            $pull: { Likes: req.userInfo._id },

        },

        { new: true }

    )



        .then((docs, err) => {

            console.log('unliked')



            res.json({ message: 'Success', success: true, likecount: docs.Likes.length });

        }).catch(err => {

            res.json({ error: err, success: false });

        });



})







router.post('/comment', auth.verifyUser, (req, res) => {

    const comment = { Text: req.body.commentText, PostedBy: req.userInfo._id };

    BookSchema.findByIdAndUpdate(

        req.body.releaseId,

        {

            $push: { Comments: comment },

        })

        .then((docs) => {

            console.log('Comment Posted')

            res.json({ success: true, commentcount: docs.Comments.length })



        }).catch(e => {

            res.json({ message: e, success: false })



        });

})


module.exports = router;
