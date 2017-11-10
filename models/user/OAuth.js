import mongoose from 'mongoose';

let OAuthSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo' },
  oauth_name: String,
  oauth_id: String,
  oauth_access_token: String,
  oauth_expires: Number
}, {timestamps: true});

OAuthSchema.methods.toAuthJSON = function(){
  return {
    uid: this.uid,
    oauth_name: this.oauth_name,
    oauth_id: this.oauth_id,
    oauth_access_token: this.oauth_access_token,
    oauth_expires: this.oauth_expires
  };
};

export default mongoose.model('OAuth', OAuthSchema);
