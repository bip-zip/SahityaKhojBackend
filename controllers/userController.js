const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const UserSchema = require("../models/user.model");
const jwt = require("jsonwebtoken");
const upload = require("../uploads/files")
const auth = require("../middlewares/auth");





// POST request (User Registration)
router.post("/user/registration", (req, res) => {
    const penname = req.body.penname
    UserSchema.findOne({
        penname: penname
    }).then((UserData) => {
        if (UserData != null) {
            res.json({ message: "Username already exist!", status: false })
            return;
        }
        // password hash
        const password = req.body.password;
        bcryptjs.hash(password, 10, (err, hashed_pw) => {

            var firstname = req.body.firstname;
            var lastname = req.body.lastname;

            // if(firstname || lastname == undefined){
            //     firstname = 'Ghumfir'
            //     lastname = 'Yatri'
            // }
            
            const address = req.body.address;
            const email = req.body.email;
            const contact = '+977 ';
            // const joined = req.body.joined;
            const pp = 'pp.png';
            const cp = 'cp.jpg';
            const bio = 'Sahitya lai khojeko maile...';

            const user = new UserSchema({
                penname: penname,
                password: hashed_pw,
                firstname: firstname,
                lastname: lastname,
                address: address,
                email: email,
                contact: contact,
                // joined: joined,
                profilePic: pp,
                coverPic: cp,
                bio:bio

            });
            console.log(user, req.body)
            user.save().then(() => {
                res.json({ message: 'Registration Complete!', status: true })
            }).catch((err) => {
                res.json({ message: err, status: false })
            })

        })
    })

})




//LOGIN
router.post("/login", (req, res) => {
    const penname = req.body.penname;

    UserSchema.findOne({ penname: penname }).then(
        (data) => {
            // if penname is present
            if (data === null) {
                return res.json({ "message": "Invalid !" })
            }
            // getting userpassword
            const password = req.body.password;
            bcryptjs.compare(password, data.password, (error, result) => {
                // if result is false invalid password
                if (!result) {
                    console.log("Invalid Password");
                    return res.json({ "message": "Invalid credentials !" })
                }

                //else token generate
                console.log("Login Success");
                const token = jwt.sign({ userID: data._id, isAdmin: data.isAdmin, isSuperUser: data.isSuperUser }, "anysecretkey");

                res.json({ "message": "Login Success", 'token': token, status: true, 'penname': penname, 'isAdmin': data.isAdmin, 'isPublisher': data.isPublisher, 'uid': data._id, 'pp': data.profilePic });
            })


        }
    )
})


// GET request
router.get("/", (req, res) => {
    UserSchema.find((err, docs) => {
        if (!err) {
            console.log(docs)
            res.json({ 'data': docs })
            // res.render('list', { 'userdata' : docs })
        }
        else {
            res.send("Error!! ")
        }
    })
})
































// GET  logged in  user info
router.get("/info", auth.verifyUser, (req, res) => {
    console.log("I got it")
    UserSchema.findOne({
        _id: req.userInfo._id
    })
        .populate("followers", "_id username firstname lastname profilePic")
        .populate("following", "_id username firstname lastname profilePic").then((docs) => {
            // console.log('followers, following', docs.followers.length)
            res.json({ 'data': docs, 'followers': docs.followers.length, 'following': docs.following.length, success: true })

        }).catch(e => {
            res.json({ 'message': 'Error', success: false })

        })
})

// GET  specific  user info
router.get("/info/:uid", auth.verifyUser, (req, res) => {
    UserSchema.findOne({
        _id: req.params.uid
    })
    .populate("followers", "_id username firstname lastname profilePic")
        .populate("following", "_id username firstname lastname profilePic")
        .then((docs) => {
            console.log('here it is ', docs)
            res.json({ 'data': docs, success: true })
        }).catch(e => {
            console.log(e)
            res.json({ 'message': 'Error', success: false })

        })


})

// GET  specific  user info
router.get("/uinfo/:uid", auth.verifyUser, (req, res) => {
    UserSchema.findOne({
        _id: req.params.uid
    })
        .then((docs) => {
            console.log('here it is ', docs)
            res.json({ 'data': docs, success: true })
        }).catch(e => {
            console.log(e)
            res.json({ 'message': 'Error', success: false })

        })


})





// update user profile
router.put("/updateprofile", auth.verifyUser, upload.fields([{ name: 'pp', maxCount: 1 }, { name: 'cp', maxCount: 1 }]), (req, res) => {
    // console.log(req.files.pp[0].filename)

    console.log('i am here')
    const __id = req.userInfo._id;
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const contact = req.body.contact
    const bio = req.body.bio

    var profilePic;
    var coverPic;
    if (req.files.pp == undefined && req.files.cp == undefined) {
        profilePic = req.userInfo.profilePic
        coverPic = req.userInfo.coverPic
    }
    else if (req.files.cp == undefined && req.files.pp != undefined) {
        profilePic = req.files.pp[0].filename
        coverPic = req.userInfo.coverPic
    }
    else if (req.files.pp == undefined && req.files.cp != undefined) {
        coverPic = req.files.cp[0].filename
        profilePic = req.userInfo.profilePic
    }
    else {
        profilePic = req.files.pp[0].filename
        coverPic = req.files.cp[0].filename
    }



    UserSchema.updateOne({ _id: __id }, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        contact: contact,
        bio: bio,
        coverPic: coverPic,
        profilePic: profilePic
    }).then((err) => {
        console.log('Update successful')
        res.json({ "message": "Update Successful!", status: true })
    }

    ).catch((e) => {
        console.log('Update not successful')
        res.json({ "message": "Went wrong!", status: false })
    })








});




















// POST request (Admin Registration)
router.post("/admin/registration", (req, res) => {
    const penname = req.body.penname
    UserSchema.findOne({
        penname: penname
    }).then((UserData) => {
        if (UserData != null) {
            res.json({ message: "Username already exist!", status: false })
            return;
        }
        // password hash

        const password = req.body.password;
        bcryptjs.hash(password, 10, (err, hashed_pw) => {

            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const address = req.body.address;
            const email = req.body.email;
            const contact = req.body.contact;
            const joined = req.body.joined;
            const isAdmin = true;

            const user = new UserSchema({
                penname: penname,
                password: hashed_pw,
                firstname: firstname,
                lastname: lastname,
                address: address,
                email: email,
                contact: contact,
                joined: joined,
                isAdmin: isAdmin,

            });
            user.save().then(() => {
                res.json({ message: 'Registration Complete!', status: true })
            }).catch((err) => {
                res.send(err)
            })

        })
    })

})

// POST request (SuperUser Registration)
router.post("/superuser/registration", auth.verifySuperUser, (req, res) => {
    const username = req.body.username
    UserSchema.findOne({
        username: username
    }).then((UserData) => {
        if (UserData != null) {
            res.json({ message: "Username already exist!", status: "Error 567!" })
            return;
        }
        // password hash

        const password = req.body.password;
        bcryptjs.hash(password, 10, (err, hashed_pw) => {

            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const address = req.body.address;
            const email = req.body.email;
            const contact = req.body.contact;
            const joined = req.body.joined;
            const isSuperUser = true;
            const isAdmin = true;



            const user = new UserSchema({
                username: username,
                password: hashed_pw,
                firstname: firstname,
                lastname: lastname,
                address: address,
                email: email,
                contact: contact,
                joined: joined,
                isSuperUser: isSuperUser,
                isAdmin: isAdmin

            });
            user.save().then(() => {
                res.json({ 'message': 'Registration Complete!', 'status': true })
            }).catch((err) => {
                res.send(err)
            })

        })
    })

})



//LOGIN

router.post("/login", (req, res) => {
    const username = req.body.username;

    UserSchema.findOne({ username: username }).then(
        (data) => {
            // if username is present
            if (data === null) {
                return res.json({ "message": "Invalid !" })
            }
            // getting userpassword
            const password = req.body.password;
            bcryptjs.compare(password, data.password, (error, result) => {
                // if result is false invalid password
                if (!result) {
                    console.log("Invalid Password");
                    return res.json({ "message": "Invalid credentials !" })
                }

                //else token generate
                console.log("Login Success");
                const token = jwt.sign({ userID: data._id, isAdmin: data.isAdmin, isSuperUser: data.isSuperUser, isPublisher:data.isPublisher }, "anysecretkey");
                console.log(data, data.isPublisher)

                res.json({ "message": "Login Success", 'token': token, status: true, 'username': username, 'isAdmin': data.isAdmin,'isPublisher': data.isPublisher, 'uid': data._id, 'pp': data.profilePic });
            })


        }
    )
})



// DELETE request
router.delete("/delete/:uid", auth.verifySuperUser, (req, res) => {
    UserSchema.findByIdAndRemove(req.params.uid).then(() => {
        console.log('Delete successss');
        res.json({ success: true, message: "User delete successful" })
    }).catch((err) => {
        console.log(err.message);
        res.json({ success: false, message: "User delete unsuccessful" })
    })
})




//UPDATE request
router.put('/update', auth.verifyUser, (req, res) => {
    const __id = req.body._id;
    const _username = req.body.username
    const _user = UserSchema.findOne({
        _id: __id
    })

    UserSchema.updateOne({ _id: __id }, { username: _username }).then(
        // res.json({"message":"Update Successful!"})
    ).catch()
})



//  update to admin
router.put('/updateadmin', auth.verifySuperUser, (req, res) => {
    const __id = req.body.user_id;
    const isAdmin = req.body.dataisAdmin
    console.log("Admin updateeeee", isAdmin)

    UserSchema.updateOne({ _id: __id }, { isAdmin: isAdmin }).then(() => {
        console.log("Admin updateeeee", isAdmin)
        res.json({ "message": "Update Successful!", success: true })
    }).catch(e => {
        console.log("errrororr", __id)
        res.json({ "message": "Update error!", success: false })
    })
})



// follow request
router.post("/follow/", auth.verifyUser, (req, res) => {
    console.log("follow request")
    UserSchema.findByIdAndUpdate(
        req.body.uid,
        {
            $push: { followers: req.userInfo._id },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
                res.json({ message: err, success: false })
            }
            UserSchema.findByIdAndUpdate(
                req.userInfo._id,
                {
                    $push: { following: req.body.uid },
                },
                { new: true }
            )
                .then((result) => {
                    console.log("When you follow", result)
                    res.json({ data: result, success: true });
                })
                .catch((err) => {
                    res.json({ message: err, success: false })
                });
        }
    );
});

// unfollow request
router.post("/unfollow", auth.verifyUser, (req, res) => {
    UserSchema.findByIdAndUpdate(
        req.body.uid,
        {
            $pull: { followers: req.userInfo._id },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
                res.json({ message: err, success: false })
            }
            UserSchema.findByIdAndUpdate(
                req.userInfo._id,
                {
                    $pull: { following: req.body.uid },
                },
                { new: true }
            )
                .then((result) => {
                    console.log("When you unfollow", result)
                    res.json({ data: result, success: true });
                })
                .catch((err) => {
                    res.json({ message: err, success: false })
                });
        }
    );
});







// router.get("/logout", function(req, res) {

//      req.logout;

//   // destroy session data
//         req.session = null;
//      res.json({"message":"Logged Out", status:true});


//    });




module.exports = router;