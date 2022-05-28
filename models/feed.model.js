const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'category'
    // },

    content: {
        type: String,
        required: true,

    },
    category: {
        type: String,


    },
   
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
   

    Shares: [{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    }],
    Likes: [{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    }],
    Comments: [
        {
            Text: String,
            PostedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const Feed = mongoose.model("feed", FeedSchema);
module.exports = Feed;