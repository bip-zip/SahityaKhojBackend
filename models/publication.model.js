const mongoose = require("mongoose");
var PublicationSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    address: {
        type: String,

    },
    user: {

        type: mongoose.Schema.ObjectId,

         ref: 'user'

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

    logo: {

        type: String,

        default:"plogo.png"

    },
    verified:{
        type:Boolean,
        default:false

    },
    documents: [{
        type: String
    }],
    companyReg:{

        type:String
    },

    contact: {
        type: String,
    },

    email: {
        type: String,
    },

    requestedDate: {
        type: Date,
        default: Date.now,
    },

    ceo: {
        type: String
    },

    seen:{
        type:Boolean
    },
    pan:{
        type:String
    }
});

const Publication = mongoose.model("publication", PublicationSchema);
module.exports = Publication;