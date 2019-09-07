const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {forwardAuthenticated} = require('../config/auth');

router.get('/login', forwardAuthenticated, (req,res)=>{
  res.render('login',
  {success_messages: req.flash('success_messages'), error_messages: req.flash('error_messages'), error: req.flash('error')});
});

router.get('/register', forwardAuthenticated, (req, res)=>{
  res.render('register');
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/dashboard',
                                   failureRedirect: '/users/login',
                                   failureFlash: true })
);

router.post('/register', (req, res)=>{
  const {name, email, password1, password2} = req.body;
  let errorNum = 0;

  if(!name || !email || !password1 || !password2){
    req.flash('error_messages','Please fill in all fields');
    errorNum++;
  }

  if(password1 != password2){
    req.flash('error_messages','Please match your passwords');
    errorNum++;
  }

  if(password1.length < 8){
    req.flash('error_messages','Password needs to be at least 8 characters long');
    errorNum++;
  }

  if(errorNum > 0){
    req.session.save(()=>{
      res.render('register',
      {name, email, password1, password2, error_messages: req.flash('error_messages')});
    });

  }else{
    User.findOne({email: email}, (err, user)=>{
      if(err){
        console.log(err);
      }else if(user){
        req.flash('error_messages', 'This email account already exists');
        req.session.save(()=>{
          res.render('register',
          {name, email, password1, password2, error_messages: req.flash('error_messages')});
        });

      }else{
        bcrypt.genSalt(10, (err, salt)=>{
          bcrypt.hash(password1, salt, (err, hash)=>{
            if(err) console.log(err);
            const newUser = new User({
              name, email, password:hash
            });
            newUser.save();
            req.flash('success_messages', 'You are registered and can log in');
            req.session.save(()=>{
              res.redirect('/users/login');
            });

          });
        });
      }
    });
  }
});

router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success_messages', 'You are logged out');
  return res.redirect('/users/login');
});

module.exports = router;
