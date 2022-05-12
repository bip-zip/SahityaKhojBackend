const express = require('express')
const app = express();
const UserController = require("./controllers/userController")


// database connection
require("./models/connection")

// cors
const cors= require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.get('/', (req,res)=>{
    res.send("I am here for you")
})

//router
app.use("/api/users", UserController)


// port config
const port = 8080;
app.listen(port,()=>{console.log("Server started !!!")})