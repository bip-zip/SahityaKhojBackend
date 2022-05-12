const jwt = require("jsonwebtoken");
const UserSchema =require("../models/user.model");


module.exports.verifyUser=(req,res,next)=>{
    try {
    const tokens = req.headers.authorization.split(" ")[1];
    const result = jwt.verify(tokens, "anysecretkey");
    UserSchema.findOne({_id:result.userID}).then(
        (res)=>{
            // console.log(res);
            req.userInfo = res;
            next();
        }
    ).catch(
        (err)=>{
            res.json({"message":err})
        }
    )
    }catch{
        res.json({message:"Invalid access!!"})
    }

}





















