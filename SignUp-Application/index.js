require("dotenv").config();
const authRoute = require("./routes/auth");


const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const app = express();
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, 
  }) 
  .then((data) => {
    console.log("DB succeed");
  })
  .catch((error) => {
    console.log("DB stopped working",error );
  }); 

app.use(cors());
app.use("/api", authRoute);


const port = process.env.PORT; 
app.get("/", (req, res) => res.send("hello there"));


app.listen(port, () => { 
  console.log(`${port}`);
});
