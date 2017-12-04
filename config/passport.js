import passport from 'passport'
import mongoose from 'mongoose'
let LocalStrategy = require('passport-local').Strategy;
import LocalAuth from '../models/user/LocalAuth' ;

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, function(email, password, done) {
  LocalAuth.findOne({email: email}).then(function(user){
    if(!user || !user.validPassword(password)){
      return done(null, false, {errors: 'Email or password is invalid'});
    }
    return done(null, user);
  }).catch(done);
}));

