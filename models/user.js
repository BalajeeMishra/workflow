const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
// const findOrCreate = require('mongoose-findorcreate');

const logoSchema=new mongoose.Schema({
    url:String,
    filename:String
});
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
    },
       username:{
        type:String,
        unique:false
     },
    // password:{
    //     type:String,
    // },
 googleId : {
        type : String, 
    } , 
 name : {
     type : String,
    } ,
 firstName : {
     type : String,
 } ,
 lastName : {
     type : String,
 },
 age:{
     type:String
 },
 compny:{
     type:String
 },
//   logo :[logoSchema],

logo: {
    type: String,
    required: [true, "Uploaded file must have a name"],
  },

 createdAt:{
   type: Date,
   default : Date.now
 }    
});
UserSchema.plugin(passportLocalMongoose);
//  UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);
module.exports = User;