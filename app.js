//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/secretsUserDB")
const schema = new mongoose.Schema(
{
  email:String,
  password:String
});

schema.plugin(encrypt, {secret:process.env.SECRET_KEY, encryptedFields:["password"]});

const User = new mongoose.model("User", schema);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res) => {
  res.render("home");
});
app.get("/login", (req,res) => {
  res.render("login");
});
app.get("/register", (req,res) => {
  res.render("register");
})
app.post("/register", async (req,res) =>{
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  })
  newUser.save().then((err) => {
      res.render("secrets");
  });
});
app.post("/login", async (req,res) =>{
  const findUser = await User.findOne({email:req.body.username});
  if(findUser.password === req.body.password){
    res.render("secrets")
  }else{
    res.send("Invalid login credentials");
  }
});




app.listen(3000, function(req,res){
  console.log("server started on port 3000");
})
