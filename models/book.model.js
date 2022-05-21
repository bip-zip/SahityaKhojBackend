const mongoose = require("mongoose");
var BookSchema = new mongoose.Schema({
    bookName: {
        type: String
    },
    bookWriter: {
        type: String,
    },
    requestedBy: {
        type: mongoose.Schema.ObjectId,
         ref: 'user'
    },
    verifiedWriter: {
        type: mongoose.Schema.ObjectId,
         ref: 'user'
    },
    publication: {
        type: String,
    },
    verifiedPublication:{
        type: mongoose.Schema.ObjectId,
        ref: 'publication'
    },
    isbn: {
        type: String,

    },
    price: {
        type: String,

    },
    availablePlaces: {
        placeName: {
            type: String
        },
        location: {
            type: String
        }
    },

    createdDate: {
        type: Date,
        default: Date.now,
    },

    publishedDate: {
        type: Date,
    },

    bookVisit:{
        type:String
    },

    bookCover:{
        type:String
    },
    abstract:{
        type:String
    },
    category:{
        type:String
    },
    awards:{
        awardName: {
            type: String
        },
        date: {
            type: Date
        }
    },
    approved:{
        type:Boolean
    },
    adminSeen:{
        type:Boolean
    }


});

const Book = mongoose.model("book", BookSchema);
module.exports = Book;











