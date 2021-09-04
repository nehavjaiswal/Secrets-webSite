//jshint esversion:6
require("dotenv").config()
const express = require ("express");
const bodyParser = require ("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));

app.set('view engine' , "ejs");

app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({  //step :3 (Level 2)
    email : String,
    password : String
});



userSchema.plugin(encrypt, { secret : process.env.SECERT , encryptedFields : ['password'] }); //step:3 (Level 2)

const User = mongoose.model("User" , userSchema);

app.get("/" ,function(req,res){
    res.render("home");
});

app.get("/login" ,function(req,res){
    res.render("login");
})


app.get("/secrets" ,function(req,res){
    res.render("secrets");
});

app.get("/submit" ,function(req,res){
    res.render("submit");
})

app.get("/register" ,function(req,res){
    res.render("register");
})
 
app.post ("/register" , function(req ,res){ // step : 1 (level 1)
    const newUser = new User ({ 
        email : req.body.username,
        password : req.body.password
    });

    newUser.save(function(err){
        if(err){
           console.log("err"); 
        }else{
            res.render("secrets");
        }
    })
});

app.post("/login" , function(req , res){  // step : 2 (level 1)
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email : username} , function(err , foundUser){ // Conditcion main toh  username aaya (L 1)
        if(err){
            console.log(err);
        }else{                         ///password our user ka  (L1)
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    })
})

app.listen(3000, function(req,res){
    console.log("server started on port 3000");
})