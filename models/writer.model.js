const mongoose = require("mongoose");
var WriterSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    requestedBy: {
        type: mongoose.Schema.ObjectId,
         ref: 'user'
    },
    verified:{
        type:Boolean,
        default:false
    },
    citizenship:{

        type:String
    },
    requestedDate: {
        type: Date,
        default: Date.now,
    },
    seen:{
        type:Boolean
    },
    bookName:{
        type:String
    },
    bookPublisher:{
        type:String
    },
    email:{
        type:String,
       default:"not updated"

    },
    contact:{
        type:String,
       default:"not updated"

    },
    dob:{
       type :String,
       default:"not updated"
    },
    profilePic:{
        type:String,
        default:'pp.png'
    },
    birthPlace:{
        type:String,
       default:"not updated"

    },
    penname:{
        type:String,
       

    },
    education:{
        type:String,
       default:"not updated"

    },
    awards:[{

        awardName: {

            type: String

        },

        description:{

            type:String

        },

        date: {

            type: String

        }

    }

    ],
    publishedBook: [{ type: mongoose.Schema.ObjectId, ref: 'book' }],
    profileVisit:{
        type:Number,
        default:1
    }
});

const Writer = mongoose.model("writer", WriterSchema);
module.exports = Writer;