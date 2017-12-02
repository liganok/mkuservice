import mongoose from 'mongoose';

let OAuthSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo' },
  oauth_name: String,
  oauth_id: String,
  oauth_access_token: String,
  oauth_expires: Number
}, {timestamps: true});

export default mongoose.model('OAuth', OAuthSchema);
