const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookreviewSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'book'
    },
    comment: {type: String},
    name: {type: String},
    // rating: {type: Number, default: 0},
    // likes: {type: Number, default: 0},
    // reports: {type: Number , default: 0},
    // likedBy: {type: []},
    // replies: {type: []},
    // isReply: {type: Boolean, default: false},
    date: {type: Date, default: new Date(Date.now())},
   

})

const BookReview = mongoose.model('bookreview', bookreviewSchema);
module.exports = BookReview