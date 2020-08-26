//jshint esversion:6

const express = require("express");
const bodyParser= require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt=require("bcrypt");
const saltRounds=10;
//const md5 = require("md5");
mongoose.connect('mongodb://localhost:27017/userBD', {useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

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
  //console.log(req.body);
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash

    });

    newUser.save(function(err){
      if(err) {
        console.log(err);
      }
      else {
        res.render("secrets");
      }
    });

});


});

app.post("/login", function(req, res){
  const enteredusername= req.body.username;
  const userpassword= (req.body.password);
  User.findOne({email: enteredusername}, function(err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      bcrypt.compare(userpassword, foundUser.password, function(err, result) {
    // result == true
        if(result==true){
            res.render("secrets");
        }
        else {
          console.log("invalid pass");
        }
       });
    }
      // console.log(enteredusername, " -- 1");
      // console.log(foundUser.email, " -- 2");
      // console.log(foundUser.password, " -- 3");
      // console.log(userpassword, " -- 4");

  });
});






app.listen(3000, function(){
  console.log("server started at 3000");
});
