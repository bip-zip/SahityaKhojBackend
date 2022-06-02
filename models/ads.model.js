const mongoose = require("mongoose");
var AdsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    link: {
        type: String,
    },
    content: {
        type: String,
    },
    requestedBy: {
        type: mongoose.Schema.ObjectId,
         ref: 'user'
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    views:{
        type:String
    },
    picture:{
        type:String
    },
    approved:{
        type:Boolean,
        default:false
    }
});

const Ads = mongoose.model("ads", AdsSchema);
module.exports = Ads;











