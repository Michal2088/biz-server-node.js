const { uniq } = require("lodash");
const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema({
  bizName: {
    type:String,
    required:true,
    minlength:2
  },
  bizAddress:{
    type:String,
    required:true,
    minlength:2
  },
  bizDescription:{
    type:String,
    required:true,
    minlength:2
  },
  bizPhone:{
    type:String,
    required:true,
    minlength:9,
    maxlength:10,
  },
  bizImage:{
    type:String,
    required:true,
  },
  cardNumber:{
    type:Number,
    required:true,
    unique:true,
  },
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    required:true,
 
  },
});

const Card = mongoose.model("cards", cardSchema);
module.exports = { Card };
