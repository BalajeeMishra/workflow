const mongoose=require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// const ImageSchema = new mongoose.Schema({
//     url: String,
//     filename: String
// });

const compnySchema= new mongoose.Schema({
    name:{
        type:String,
        // required:true
    },
    location:{
        type:String,
        // required:true
    },
    category:{
        type:String,
        // required:true
    },
    about:{
        type:String
    },
      logo: {
        type: String,
        required: [true, "Uploaded file must have a name"],
      },
      count:{
          type:Number
      },
      username:{
          type:String,
          unique:true
      }
});
compnySchema.plugin(passportLocalMongoose);
const Compny= mongoose.model("Compny", compnySchema);
module.exports=Compny;
