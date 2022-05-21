const express = require('express')
const app = express();
const UserController = require("./controllers/userController")
const BookController = require("./controllers/bookController")

// database connection
require("./models/connection")

// for displaying uploaded images
app.use(express.static(__dirname+'/images'));
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
app.use("/api/books", BookController)


// port config
const port = 8080;
app.listen(port,()=>{console.log("Server started !!!")})