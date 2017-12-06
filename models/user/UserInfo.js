import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';
import { secret } from '../../config/config'

let UserInfoSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  username: String,
  mobile: String,
  image: String,
  auth_type: {type:String,default:'L'}, //O:oAuth   L:local outh
}, { timestamps: true });

UserInfoSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserInfoSchema.methods.toJSON = function () {
  return {
    uid: this._id,
    username: this.username,
    email: this.email,
    mobile: this.mobile,
    image: this.image,
  };
};

UserInfoSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 5);

  return jwt.sign({
    uid: this._id,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserInfoSchema.methods.toAuthJSON = function () {
  return {
    uid: this._id,
    username: this.username,
    email: this.email,
    mobile: this.mobile,
    image: this.image,
    auth_type: this.auth_type,
    token: this.generateJWT()
  };
};

export default mongoose.model('UserInfo', UserInfoSchema);
