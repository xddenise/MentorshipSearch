const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/user');

router.get("/", ensureAuthenticated, function(req,res){
  res.render('search');
});

router.post("/expertise", function(req,res){



  res.render('display');

});

router.post("/name", function(req,res){
  const {name} = req.body;

  User.find({name: name}, (err, users)=>{
    if(err){
      console.log(err);
    }else if(users){
      console.log(users);
      return res.render('display', {users: users});
    }else{
      return res.render('display', {error_messages: "Employee not found."});
    }});
});

module.exports = router;
