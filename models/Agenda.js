/**
 * Created by Administrator on 2017/5/31.
 */
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let User = mongoose.model('User');

let AgendaSchema = new mongoose.Schema({
  name:String,
  startedAt:Date,
  isRoot: {type:Boolean,default:true},
  duration:{type:Number,default:0},
  sequence:{type:Number,default:0},
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  subItems:[{type:mongoose.Schema.Types.ObjectId,ref:'Agenda'}],
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

AgendaSchema.methods.toJSON = function () {
  return{
    id:this._id,
    name:this.name,
    isRoot:this.isRoot,
    duration:this.duration,
    sequence:this.sequence,
    subItems:this.subItems? this.subItems:[],
    startedAt:this.startedAt,
    updatedAt:this.updatedAt,
    createdAt:this.createdAt,
  };
};

mongoose.model('Agenda',AgendaSchema);
