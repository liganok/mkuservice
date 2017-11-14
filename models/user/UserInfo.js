import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let UserInfoSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  username: String,
  mobile: String,
  image: String
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

export default mongoose.model('UserInfo', UserInfoSchema);
