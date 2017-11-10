import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
var secret = require('../config').secret;


let LocalAuthSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo' },
  hash: String,
  salt: String
}, {timestamps: true});

LocalAuthSchema.plugin(uniqueValidator, {message: 'is already taken.'});
LocalAuthSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

LocalAuthSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

LocalAuthSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    uid: this.uid,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

LocalAuthSchema.methods.toAuthJSON = function(){
  return {
    uid: this.uid,
    email: this.email,
    token: this.generateJWT()
  };
};

export default mongoose.model('LocalAuth', LocalAuthSchema);
