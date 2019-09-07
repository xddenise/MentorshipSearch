const express = require('express');
const router = express.Router();
const {forwardAuthenticated, ensureAuthenticated} = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res)=>{
  res.render('index');
});

router.get("/dashboard", ensureAuthenticated, function(req,res){
  res.render('dashboard');
});

module.exports = router;
