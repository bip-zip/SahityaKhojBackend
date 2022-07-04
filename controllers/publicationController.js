const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const PublicationSchema = require("../models/publication.model");
const UserSchema = require("../models/user.model");
const jwt = require("jsonwebtoken");
const upload = require("../uploads/files");
const auth = require("../middlewares/auth");
// const { mail } = require("../utils/mail");


// POST request (User Registration)
router.post("/publication-request", upload.single("companyReg"), (req, res) => {
  const email = req.body.email;
  var companyReg = "";
  if (req.file == undefined) {
    res.json({ msg: "Wrong file format", status: false });
  } else {
    companyReg = req.file.filename;
  }
  PublicationSchema.findOne({
    email: email,
  }).then((UserData) => {
    if (UserData != null) {
      res.json({ message: "Email already registered!", status: false });
      return;
    }

    var name = req.body.name;
    const address = req.body.address;
    const email = req.body.email;
    const contact = req.body.contact;
    const pan = req.body.pan;

    const publication = new PublicationSchema({
      name: name,
      address: address,
      email: email,
      contact: contact,
      pan: pan,
      companyReg: companyReg,
    });
    publication
      .save()
      .then(() => {
        res.json({ message: "Request Successful!", status: true });
      })
      .catch((err) => {
        res.json({ message: err, status: false });
      });
  });
});

// get publications
router.get("/", (req, res) => {
  PublicationSchema.find()
    .sort([["requestedDate", -1]])
    .then((docs) => {
      res.json({ data: docs, status: true });
    })
    .catch((e) => {
      res.json({ msg: "Error", status: false });
    });
});

//verify get publications
router.get("/verified", (req, res) => {
  PublicationSchema.find({ verified: true })
    .sort([["requestedDate", -1]])
    .then((docs) => {
      res.json({ data: docs, status: true });
    })
    .catch((e) => {
      res.json({ msg: "Error", status: false });
    });
});

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function registerPublication(_email) {
  const password = generatePassword();
  const penname = _email.split("@")[0];
  console.log(password)

  UserSchema.findOne({
    email: _email,
  }).then((UserData) => {
    if (UserData != null) {
      console.log("publication not registered", UserData);
      return false;
    } else {
      bcryptjs.hash(password, 10, (err, hashed_pw) => {
        const user = new UserSchema({
          penname: penname,
          password: hashed_pw,
          email: _email,
          isPublisher: true,
        });
        user.save();


        

        PublicationSchema.findOneAndUpdate(
          { email: _email },
          { user: user._id }
        ).then((docs) => {
          console.log(docs, "vayo");
        });

        
        // mail
    // var mailOptions = {
    //   from: 'herohiralaal14@gmail.com',
    //   to: _email,
    //   subject: "Sahitya Khoj ✍ : Congratulations, Publication Verified. ",
    //   html: `<h4>Login with your Penname:${penname} and Password: ${password}</h4>`
    // };
    
    // mail(mailOptions);
      });
    }
  });
}

// publication verify
router.put("/verify", auth.verifyAdmin, (req, res) => {
  const pubId = req.body.pubid;
  const email = req.body.email;
  const approved = req.body.approved;
  console.log(approved);
  PublicationSchema.findByIdAndUpdate(pubId, { verified: approved })
    .then((docs) => {
      if (approved) {
        // registerPublication(email)
        console.log(registerPublication(email), docs);

        res.json({ message: "Success!", status: true });
      } else {
        UserSchema.deleteOne({ email: email }).then((docs) => {
          res.json({ message: "Success!", status: true });
        });
      }
    })
    .catch((e) => {
      res.json({ message: "Went wrong!", status: false });
    });
});

// posting awards
router.post("/add-awards", auth.verifyUser, (req, res) => {
  const award = {
    awardName: req.body.awardName,
    description: req.body.description,
    date: req.body.date,
  };
  console.log(award, req.body.awardName, req.body.description, req.body.date);
  PublicationSchema.findOneAndUpdate(
    { user: req.userInfo._id },
    {
      $push: { awards: award },
    }
  )
    .then((docs) => {
      res.json({ status: true });
    })
    .catch((e) => {
      res.json({ message: e, success: false });
    });
});

// router.get("/info", auth.verifyUser, (req, res) => {
//     console.log("I got it")
//     PublicationSchema.findOne({
//         requestedBy: req.userInfo._id
//     }).then((docs) => {
//             res.json({ 'data': docs,  success: true })

//         }).catch(e => {
//             res.json({ 'message': 'Error', success: false })

//         })
// })

router.get("/information/:pubId", (req, res) => {
  console.log("hitted", req.params.pubId);
  PublicationSchema.findOne({
    user: req.params.pubId,
  })
    .then((docs) => {
      // console.log('followers, following', docs.followers.length)
      // console.log('here it is ', docs.profileVisit)
      // profileVisitInc(req.userInfo._id,docs.profileVisit);

      console.log(docs);

      res.json({ data: docs, success: true });
    })
    .catch((e) => {
      res.json({ message: "Error", success: false });
    });
});

router.put(
  "/update",
  upload.single("profilePic"),
  auth.verifyUser,
  (req, res) => {
    if (req.file == undefined) {
      const user = req.userInfo._id;
      const contact = req.body.contact;
      const email = req.body.email;
      const address = req.body.address;

      PublicationSchema.updateOne(
        { user: user },
        {
          contact: contact,
          email: email,
          address: address,
         
        }
      )
        .then((result) => {
          res.json({ message: "Update Successful!", status: true });
        })
        .catch((e) => {
          res.json({ message: "Update error!", status: false });
        });
    } else {
        const user = req.userInfo._id;
        const contact = req.body.contact;
        const email = req.body.email;
        const address = req.body.address;
      const profilePic = req.file.filename;
      PublicationSchema.updateOne(
        { user: user },
        {
            contact: contact,
            email: email,
            address: address,
          logo: profilePic,
        }
      )
        .then((result) => {
          //    console.log("picuploaded")
        
          res.json({ message: "Update Successful!", success: true });
        })
        .catch((e) => {
          res.json({ message: "Update error!", success: false });
        });
    }
  }
);

module.exports = router;
