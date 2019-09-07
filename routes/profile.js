const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

router.get("/", ensureAuthenticated, function(req,res){
  res.render('profile', {user: req.user});
});

router.get("/edit", ensureAuthenticated, function(req,res){
  res.render('editProfile', {user: req.user});
});

router.get("/pw", ensureAuthenticated, function(req,res){
  res.render('editPassword');
});

module.exports = router;
