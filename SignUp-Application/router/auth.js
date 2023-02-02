const express = require("express");
const cors = require('cors')

const { signup, signin, forgotPassword, resetPassword, googlelogin} = require("../controller/auth");

var router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.put("/forgot-password", forgotPassword);


router.put("/reset-password", resetPassword);

router.post("/googlelogin", googlelogin);
module.exports = router;
