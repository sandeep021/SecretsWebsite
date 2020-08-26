//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser= require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect('mongodb://localhost:27017/userBD', {useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET , requireAuthenticationCode: false, encryptedFields:["password"]});//read plugin

const User= mongoose.model("User", userSchema);

const app= express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.email,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err) {
      console.log(err);
    }
    else {
      res.render("secrets");
    }
  })
});

app.post("/login", function(req, res){
  const username= req.body.email;
  const userpassword= req.body.password;
  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser.password === (userpassword)){
            res.render("secrets");
      }
      else {
        console.log("invalid pass");
      }
    }
  });
});






app.listen(3000, function(){
  console.log("server started at 3000");
});