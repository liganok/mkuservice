import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let UserInfoSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
  email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  mobile: String,
  image: String
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserInfoSchema.methods.toJSON = function () {
  return {
    uid: this._id,
    username: this.username,
    email: this.email,
    mobile: this.mobile,
    image: this.image,
  };
};

export default mongoose.model('UserInfo', UserInfoSchema);
