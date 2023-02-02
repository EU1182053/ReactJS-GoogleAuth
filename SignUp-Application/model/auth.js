var mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    maxlength: 30,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 30,
    
  },
  resetLink:{
    data: String
  }
});




module.exports = mongoose.model("User", userSchema);

