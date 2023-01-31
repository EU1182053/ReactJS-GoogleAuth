require("dotenv").config();



const express = require("express");
const mongoose = require("mongoose");

const app = express();

const cors = require("cors");

const bodyParser = require("body-parser");
const authRoute = require("./router/auth");
mongoose 
  .connect(process.env.DATABASE, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  }) 
  .then((data) => { 
    console.log("DB succeed");
  })
  .catch((error) => {
    console.log("DB stopped working",error );
  }); 
 
mongoose.set('strictQuery', true)
app.use(cors());
app.use(bodyParser.json()); 

app.use("/api", authRoute);


const port = process.env.PORT; 
app.get("/", (req, res) => res.send("hello there"));


app.listen(port, () => { 
  console.log(`${port}`);
});
