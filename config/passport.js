const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const config = (passport)=>{
  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  (username, password, done)=>{
    User.findOne({email:username}, (err, user)=>{
      if(err) {return done(err);}
      if(!user){
        console.log('email not registered');
        return done(null, false, {message: 'Email not registered' });
      }
      bcrypt.compare(password, user.password, (err, isMatched) =>{
        if(err){return done(err)}
        if(isMatched){
          return done(null, user);
        }else{
          console.log('incorrect password');
          return done(null, false, {message: 'Incorrect password'})
        }
      });
    });
  }
  ));

  passport.serializeUser((user, done)=>{
    done(null, user.id);
  });

  passport.deserializeUser((id, done)=>{
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}

module.exports = config;
