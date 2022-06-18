const mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    penname: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters']
    },

    email: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        unique: true,
        lowercase: true,
        required: 'Email is Required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },

    password: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        required: 'Password is Required',
    },

    firstname: {
        type: String,

    },

    lastname: {
        type: String,

    },

    address: {
        type: String,

    },

    contact: {
        type: String,

    },

    joined: {
        type: Date,
        default: Date.now,
    },
    bio: {
        type: String
    },

    isUser: {
        type: Boolean,
        default: true,
    },
    isPublisher: {
        type: Boolean,
        default: false,
    },
    isWriter: {
        type: Boolean,
        default: false,
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    isSuperUser: {
        type: Boolean,
        default: false
    },

    profilePic: {
        type: String
    },

    coverPic: {
        type: String
    },

    following: [{ type: mongoose.Schema.ObjectId, ref: 'user' }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'user' }],

    profileVisit:{
        type:Number,
        default:'1'
    },
    googleId:{
        type: String
    }
    
});

const User = mongoose.model("user", UserSchema);
module.exports = User;