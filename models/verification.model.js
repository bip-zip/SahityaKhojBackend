const mongoose = require('mongoose');
const VerificationToken = mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required: true
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        expires:1800,
        default: Date.now()
    }
})
module.exports = mongoose.model('VerificationToken' , VerificationToken)