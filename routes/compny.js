const express=require("express");
const router=express.Router();
const Compny= require("../models/compny");
const multer = require('multer');
const {isLoggedIn}= require("../middleware");
const {isAdmin}=require("../middleware");
// const { storage } = require("../cloudinary/index");
// const upload = multer({ storage });
// const { cloudinary } = require("../cloudinary");

const multerStorage= multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,"public"); 
    },
    filename: (req, file, cb) => {
     const fileName = file.originalname.toLowerCase().split(' ').join('-');
     cb(null,fileName);
     // const ext =file.mimetype.split("/")[1];
     // cb(null, `files\admin-${file.fieldname}-${Date.now()}.${ext}`);
   }
});



const upload = multer({
 storage: multerStorage,
 fileFilter: (req, file, cb) => {
     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
         cb(null, true);
     } else {
         cb(null, false);
         return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
     }
 }
});


router.get("/listed",async(req,res)=>{
    const compny=await Compny.find({});
    res.render("listedCompany",{compny,home:req.user});
});
router.get("/tech/:id",async(req,res)=>{
    const{id}=req.params;
    const compny=await Compny.findById(id);
    console.log(compny);
    res.render("showcompny",{compny,home:req.user});
});

router.get("/show",isLoggedIn,async(req,res)=>{
const compny=  await Compny.find({});
 res.render("index.ejs",{compny, home:req.user});
});
router.get("/createcompny",(req,res)=>{
    res.render("createCompny");
});
router.get("/fillup",async(req,res)=>{
    res.render("fillCompny");
});
router.post("/added",upload.single("logo"), async(req,res)=>{
     const compny=new Compny(req.body);
     compny.logo= req.file.filename;
     await compny.save();
     res.redirect("/");
});
module.exports=router;

