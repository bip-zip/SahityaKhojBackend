const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/sahityakhoj", { useNewUrlParser:true, useUnifiedTopology : true }, (error)=>{
    if(!error){
        console.log('Success')
    }
    else{
        console.log('Error')
    }
});

// const User=require("moduleuser")

    