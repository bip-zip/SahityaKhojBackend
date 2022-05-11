const express = require('express')
const app = express();




app.get('/', (req,res)=>{
    res.send("I am here for you")
})


// port config
const port = 8080;
app.listen(port,()=>{console.log("Server started !!!")})