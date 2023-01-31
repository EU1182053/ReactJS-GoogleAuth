const express = require("express");
const cors = require('cors')

const { signup} = require("../controller/auth");

var router = express.Router();

router.post("/signup", signup);


module.exports = router;
