const User = require("../model/auth");
"use strict";
const nodemailer = require("nodemailer");


exports.signup = async(req, res) => {


  var email = req.body.email;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      const user = new User(req.body);
      user.save(async (err, user) => {
        if (err) {
          return res.status(400).json({
            Message: err.message,
          });
        }
        
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
          host:'smtp.gmail.com',
          service: 'gmail',
          secure: false,
          auth: {
            user: 'siddheshs871@gmail.com',
            pass: 'cdekdtzjvysxsrqh'
          }
        });
        
        var mailOptions = {
          from: 'siddheshs871@gmail.com',
          to: 'sawants3194@gmail.com',
          subject: 'Sending Email using Node.js',
          text: 'That was easy!'
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.json(user);
          }
        });
        
      });
    }
    else {
      return res.status(400).json({
        Message: "Email exists",
      });
    }
  })


};