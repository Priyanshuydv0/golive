const mongoose=require("mongoose");
const { Schema } = mongoose;

const Userschema = new Schema({
  name:{
    type:String,
  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});
const User = mongoose.model('User', Userschema);
module.exports=User;