const nodemailer = require('nodemailer')

exports.mail = (mailOptions) =>
    {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'herohiralaal14@gmail.com',
              pass: 'pgvcnftoijykjjhn'
            }
          });
          
          
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });


    }