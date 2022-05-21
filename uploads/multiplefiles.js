// multer
const multer =require("multer");

// file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});


const uploads = multer({
    storage:storage
});

module.exports=uploads;