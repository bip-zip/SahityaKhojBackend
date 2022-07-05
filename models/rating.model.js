const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'book'
    },
    star: {
        type: Number,
        default: 0,
        min:0,
        max:5
    }

},{timestamp: true})

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating