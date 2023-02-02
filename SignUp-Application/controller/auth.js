const User = require("../model/auth");
var jwt = require("jsonwebtoken");
const _ = require('lodash');
const { GoogleAuth, JWT, OAuth2Client } = require('google-auth-library');

const nodemailer = require("nodemailer");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.signup = async (req, res) => {

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
          host: 'smtp.gmail.com',
          service: 'gmail',
          secure: false,
          auth: {
            user: 'siddheshs871@gmail.com',
            pass: 'cdekdtzjvysxsrqh'
          }
        });

        var mailOptions = {
          from: 'siddheshs871@gmail.com',
          to: email,
          subject: 'Sign Up Request',
          text: 'Sign Up Request'
        };

        transporter.sendMail(mailOptions, function (error, info) {
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

exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json({
        error: "User does not exists",
      });
    }

    if (user.password !== password) {
      return res.json({
        error: "password does not match.",
      });
    }

    // creating a token
    var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '1h' });

    //put token in cookie
    res.cookie("token", token, { expire: '1h' });

    return res.json({

      token: token,
      user: user,
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successful",
  });
};

exports.forgotPassword = (req, res) => {

  var email = req.body.email;

  User.findOne({ email }, (err, user) => {

    if (err || !user) {
      return res.json({
        error: "User does not exists",
      });
    }


    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      secure: false,
      auth: {
        user: 'siddheshs871@gmail.com',
        pass: process.env.GOOGLE_PASSWORD
      }
    });

    // creating a token
    var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '20m' });
    var mailOptions = {
      from: 'noreply@hello.com',
      to: email,
      subject: 'Account Activation Link',
      text: `Please click on the given link to reset your password. ${process.env.CLIENT_URL}/resetpassword/${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({
          error: "nodemailer error"
        })
      } else {
        console.log('Email sent: ' + info.response);

      }
    });

    return user.updateOne({ resetLink: token }, (err, success) => {
      if (err)
        return res.status(400).json({
          error: "reset password link error."
        })
      else {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {

            return res.json({ message: "Email has been sent, kindly follow the instructions" });
          }
        });
      }
    })

  }

  )

}


exports.resetPassword = (req, res) => {
  const { resetLink, newPass } = req.body;

  if (resetLink) {
    jwt.verify(resetLink, process.env.SECRET, function (error, decodedData) {
      if (error) {
        return res.status(401).json({
          error: "Incorrect token or it is expired!!!"
        })
      }

      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          return res.status(401).json({
            error: "User with this token does not exists"
          })
        }

        const obj = {
          password: newPass,
          resetLink: ''
        }

        user = _.extend(user, obj);

        user.save(async (err, user) => {
          if (err) {
            return res.status(400).json({
              Message: "Reset password error.",
            });
          }
          else {
            return res.status(200).json({
              Message: "Your password has been changed.",
            });
          }
        })
      })

    })
  }
  else {
    return res.status(401).json({ error: "Authentication error!!" })
  }
}


exports.googlelogin = (req, res) => {
  const { tokenId } = req.body;

  client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
    const { email, email_verified, name } = response.payload;
    
    if (email_verified) {
      User.findOne({ email }, (err, user) => {
        console.log("user", user)
        if (err) {
          return res.json({
            error: err.message,
          });
        }
        else {

          if (user !== null) {
            
            // creating a token
            var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '7h' });

            return res.json({
              token: token,
              user: user
            })
          }
          else {

            let password = email + process.env.SECRET;
            let newUser = new User({ name, email, password });
            newUser.save( (err, user) => {
              if (err) {
                return res.status(400).json({
                  Message: "Something went wrong with saving the newuser.",
                });
              }
              else {
                console.log("user", user)
                var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '7h' });
                
                return res.json({
                  token: token,
                  user: user
                })
              }
            })
          }
        }
      })
    }
  })

}