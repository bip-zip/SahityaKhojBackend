// multer
const multer =require("multer");

// file upload

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, './images/')
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + file.originalname)

    }
})

// code for filtering file
const filter = (req,file,cb)=>{
    if(file.mimetype == 'image/png' || file.mimetype=='image/jpeg' || file.mimetype=='image/jpg'){
        // correct format
        cb(null,true)
    }
    else{
        // incorrect format
        cb(null, false)
    }

}

const upload = multer({
    storage:storage,
    filter:filter
});









module.exports=upload;