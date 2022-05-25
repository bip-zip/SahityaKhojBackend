const express = require('express')
const app = express();
const UserController = require("./controllers/userController")
const BookController = require("./controllers/bookController")
const PublicationController = require("./controllers/publicationController")
const FeedController = require("./controllers/feedController")





// database connection
require("./models/connection")

// for displaying uploaded images 
app.use(express.static(__dirname+'/images'));





// cors
const cors= require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// frontpage
app.get('/', (req,res)=>{
    res.send("Sahitya khoj api")
})

//router
app.use("/api/users", UserController)
app.use("/api/books", BookController)
app.use("/api/publications", PublicationController)
app.use("/api/feeds", FeedController)







// port config
const port = 8080;
app.listen(port,()=>{console.log("Server started !!!")})