const User = require("../model/auth");


exports.signup = (req, res) => {
  

  var email = req.body.email;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      const user = new User(req.body);
      user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            Message: err.message,
          });
        }
        res.json(user);
      });
    }
    else {
      return res.status(400).json({
        Message: "Email exists",
      });
    }
  })

  
};