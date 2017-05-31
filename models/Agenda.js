/**
 * Created by Administrator on 2017/5/31.
 */
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let User = mongoose.model('User');

let AgendaSchema = new mongoose.Schema({
  name:String,
  startAt:Date,
  duration:{typeName:Number,default:0},
  sequence:{typeName:Number,default:0},
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  subItems:[this],
},{timestamps:true});

AgendaSchema.methods.updateDuration = function () {
  let agenda = this;
  return this.find({_id:{$in:[this.subItems]}}).then(function (data) {
    let sum = 0;
    data.map((item)=>{
      sum += item.duration;
    });
    return agenda.save();
  });
};

AgendaSchema.methods.toJSONFro = function () {
  return{
    id:this._id,
    name:this.name,
    duration:this.duration,
    sequence:this.sequence,
    user:this.user
  }
};

mongoose.model('Agenda',AgendaSchema);
