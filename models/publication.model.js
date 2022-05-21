const mongoose = require("mongoose");
var PublicationSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    address: {
        type: String,

    },
    
    kyc_verified:{
        type:Boolean,
        default:false

    },

    documents: [{
        type: String
    }],

    contact: {
        type: String,
    },

    email: {
        type: String,
    },

    joined: {
        type: Date,
        default: Date.now,
    },

    ceo: {
        type: String
    },
});

const Publication = mongoose.model("publication", PublicationSchema);
module.exports = Publication;











