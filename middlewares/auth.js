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































module.exports.verifyAdmin=(req,res,next)=>{
    try {
    const tokens = req.headers.authorization.split(" ")[1];
    const result = jwt.verify(tokens, "anysecretkey");
    // console.log(tokens);
    // console.log(result);
    // console.log(result.userID);

    UserSchema.findOne({_id:result.userID}).then(
        (res)=>{
            if(result.isAdmin){
                // console.log(res);
            req.userInfo = res;
            next();

            }
            else{
                res.json({message:"only admin and self user access!!"})
            }
            
        }
    ).catch(
        (err)=>{
            res.json({message:err})
        }
    )
    }catch{
        res.json({message:"only admin and self user access!!"})
    }

}


module.exports.verifySuperUser=(req,res,next)=>{
    try {
    const tokens = req.headers.authorization.split(" ")[1];
    const result = jwt.verify(tokens, "anysecretkey");
    // console.log(tokens);
    // console.log(result);
    // console.log(result.userID);

    UserSchema.findOne({_id:result.userID}).then(
        (res)=>{
            if(result.isSuperUser){
                console.log(res);
            req.userInfo = res;
            next();

            }
            else{
                res.json({message:"only Superuser and self user access!!"})
            }
            
        }
    ).catch(
        (err)=>{
            res.json({message:err})
        }
    )
    }catch{
        res.json({message:"only admin and self user access!!"})
    }

}