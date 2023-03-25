//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'Our little secret.',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/secretsUserDB")
const schema = new mongoose.Schema(
{
  email:String,
  password:String
});

schema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", schema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req,res) => {
  res.render("home");
});
app.get("/login", (req,res) => {
  res.render("login");
});
app.get("/register", (req,res) => {
  res.render("register");
})

app.get("/secrets", (req,res)=>{
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/login");
  }
})
app.post("/register", async (req,res) =>{
User.register({username: req.body.username}, req.body.password, (err,user) =>{
  if (err){
    console.log(err);
    res.redirect("/register")
  }else{
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/secrets");
    })
  }
})
});
app.post("/login", async (req,res) =>{
const user = new User({
  username: req.body.username,
  password: req.body.password
});
req.login(user,function(err){
  if(err){
    console.log(err);
  }else{
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/secrets");
    })
  }
})
});

app.get("/logout", (req,res)=>{
  req.logout((err)=>{
    if(err){console.log(err)};
  });
  res.redirect("/")
});


app.listen(3000, function(req,res){
  console.log("server started on port 3000");
})
