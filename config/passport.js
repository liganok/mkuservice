import passport from 'passport'
import mongoose from 'mongoose'
let LocalStrategy = require('passport-local').Strategy;
import LocalAuth from '../models/user/LocalAuth' 
import UserInfo from '../models/user/UserInfo';


passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
},async function(email, password, done) {
  try {
    let user = await LocalAuth.findOne({ email: email })
    if (!user || !user.validPassword(password)) {
      return done(null, false, { errors: 'Email or password is invalid' });
    }
    let userInfo = await UserInfo.findById(user.uid)
    return done(null, userInfo)
  } catch (error) {
    
  }
  LocalAuth.findOne({email: email}).then(function(user){
    if(!user || !user.validPassword(password)){
      return done(null, false, {errors: 'Email or password is invalid'});
    }
    return done(null, user);
  }).catch(done);
}));

