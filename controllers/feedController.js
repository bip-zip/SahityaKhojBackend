const express = require("express");
const router = express.Router();
const FeedSchema = require("../models/feed.model");
const auth = require('../middlewares/auth')
const upload = require("../uploads/files")

// all feeds 
router.get("/", (req, res) => {
    FeedSchema.find()
        .populate("user", "_id penname firstname lastname profilePic")
        .populate("Comments.PostedBy", "_id penname firstname lastname profilePic")
        .sort([['date', -1]])
        .then((docs) => {
            let feeds = [];
            docs.map((item) => {
                feeds.push({
                    _id: item._id,
                    title: item.title,
                    content: item.content,
                    user: item.user,
                    date: item.date,
                    category: item.category,
                    Shares: item.Shares,
                    Likes: item.Likes,
                    Comments: item.Comments,
                });
            });

            res.json({ 'data': feeds, 'success': true })
        }).catch(e => {
            res.json({ 'msg': 'Error', 'success': false })
        })
});


// add feed
router.post("/add", auth.verifyUser, (req, res) => {
    console.log("hitted")
    
    const user = req.userInfo._id;
    const content = req.body.content;
    const title = req.body.title;
    const category = req.body.category;
    const feed = new FeedSchema({
        user: user,
        content: content,
        title: title,
        category: category
    });
    feed.save((err, doc) => {
        if (!err) {
            console.log('saveddddd')
            res.json({ message: "Sucessful", status: true })
        }
        else {
            console.log('errrrr', err)

            res.json({ message: err, status: false })

        }
    });
})

// like blog
router.put('/like', auth.verifyUser, (req, res) => {

    FeedSchema.findByIdAndUpdate(
        req.body.feedId,
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


// unlike blog
router.put('/unlike', auth.verifyUser, (req, res) => {

    FeedSchema.findByIdAndUpdate(
        req.body.feedId,
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

// to  show single feed
router.get("/feed/:feedId", (req, res) => {
    const feedId = req.params.feedId;
    FeedSchema.findById(feedId)
        .populate("user", "_id penname firstname lastname profilePic")
        .populate("Comments.PostedBy", "_id penname firstname lastname profilePic")
        .then(data => {
            res.json({ data: data, status: true })
        }).catch(e => {
            res.json({ status: false })
        })
});

// update feed
router.put('/update', auth.verifyUser, (req, res) => {
        const __id = req.body.feedId;
        const content = req.body.content;
        const title = req.body.title;
        const category = req.body.category;

        FeedSchema.updateOne({ _id: __id }, { content: content, title: title, category: category }).then(result => {
            res.json({ "message": "Update Successful!", status: true })
        }).catch(e => {
            res.json({ "message": "Update error!", status: false })
        })

})


// feeds of individual user
router.get("/ind-feeds/:uid", (req, res) => {
    const _user = req.params.uid;
    FeedSchema.find({user:_user})
        .populate("user", "_id penname firstname lastname profilePic")
        .populate("Comments.PostedBy", "_id firstname lastname profilePic")
        .sort([['date', -1]])
        .then((docs) => {
            let feeds = [];
            docs.map((item) => {
                feeds.push({
                    _id: item._id,
                    title: item.title,
                    content: item.content,
                    user: item.user,
                    date: item.date,
                    category: item.category,
                    Shares: item.Shares,
                    Likes: item.Likes,
                    Comments: item.Comments,
                });
            });

            res.json({ 'data': feeds, 'success': true })
        }).catch(e => {
            res.json({ 'msg': 'Error', 'success': false })
        })
});

// to  show single blog
router.get("/blogdetail/:bid", (req, res) => {
    const blogid = req.params.bid;
    BlogSchema.findById(blogid)
        .populate("user", "_id firstname lastname profilePic")
        .populate("Comments.PostedBy", "_id firstname lastname profilePic")
        .then(data => {
            res.json({ data: data })
        }).catch(e => {
            res.json({ status: false })
        })
});




// blog delete
router.delete("/delete/:bid", auth.verifyUser, (req, res) => {
    BlogSchema.findByIdAndRemove(req.params.bid).then((blog) => {
        console.log('Delete successss');

        res.json({ success: true, message: "Delete successful" })
    }).catch((err) => {
        console.log(err.message);
        res.json({ success: false, message: "Delete unsuccessful" })
    })
})

// update blog
router.put('/update', auth.verifyUser, upload.single('thumbnail'), (req, res) => {

    if (req.file == undefined) {

        const __id = req.body.bid;
        const description = req.body.desc;
        const title = req.body.title;
        const travel_type = 'hiking';

        BlogSchema.updateOne({ _id: __id }, { description: description, title: title, travel_type: travel_type }).then(result => {
            res.json({ "message": "Update Successful!", success: true })
        }).catch(e => {
            console.log("errrororr", __id)

            res.json({ "message": "Update error!", success: false })
        })
    }
    else {
        const __id = req.body.bid;
        const description = req.body.desc;
        const title = req.body.title;
        const travel_type = req.body.travel_type;
        const thumbnail = req.file.filename
        BlogSchema.updateOne({ _id: __id }, { description: description, title: title, travel_type: travel_type, thumbnail: thumbnail }).then(result => {
            //    console.log("picuploaded")
            res.json({ "message": "Update Successful!", success: true })
        }).catch(e => {
            res.json({ "message": "Update error!", success: false })
        })

    }


})



// posting comments
router.post('/comment', auth.verifyUser, (req, res) => {
    const comment = { Text: req.body.commentText, PostedBy: req.userInfo._id };
    FeedSchema.findByIdAndUpdate(
        req.body.feedId,
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


// blog of individual user
router.get("/indblogs/:uid", auth.verifyUser, (req, res) => {
    console.log("hitted")

    const user = req.params.uid;
    BlogSchema
        .find({ user: user }, null, { sort: '-date' }).populate('user','_id username firstname lastname profilePic')
        .then((docs)=>{
                res.json({ data: docs, 'bcount': docs.length, success: true })

        }).catch(e=>{
            res.json({ success: false })
        })
        // , (err, docs) => {
        //     if (!err) {

        //         res.json({ data: docs, 'bcount': docs.length, success: true })
        //     }
        //     else {
        //         res.json({ success: false })

        //     }
        // })
});















































































// test test and test
router.get('/test', (req, res) => {

    BlogCommentSchema.find().populate("user", "_id firstname")
        .populate("blog", "_id title")
        .then((data) => {
            let posts = [];
            data.map((item) => {
                posts.push({
                    _id: item._id,
                    Blog: item.blog,
                    Content: item.content,
                    PostedBy: item.user,
                    // Photo: item.Photo.toString("base64"),
                    // PhotoType: item.PhotoType,
                    // Likes: item.Likes,
                    // Comments: item.Comments,
                });
            });
            console.log('here it is ', posts)
            res.json({ posts });
        })
        .catch((err) => {
            console.log(err);
        });
})




module.exports = router;
