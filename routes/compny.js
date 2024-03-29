const express=require("express");
const router=express.Router();
const Compny= require("../models/compny");
const AppError = require("../controlError/AppError");
const wrapAsync = require("../controlError/wrapasync");
const multer = require('multer');
const {isLoggedIn}= require("../middleware");
const {isAdmin}=require("../middleware");
const User=require("../models/user");

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


router.get("/listed",isLoggedIn,async(req,res)=>{
    const compny=await Compny.find({});
    res.render("listedCompany",{compny,home:req.user});
});
router.get("/admin/:id",isLoggedIn,wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const compny = await Compny.findById(id);
    res.render("edit_admin", { compny,home:req.user });
}));

router.put("/admin/:id",upload.single("logo"),isLoggedIn, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const compny = await Compny.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    compny.logo= req.file.filename;
    await compny.save();
    res.redirect("/compny/listed");
}));

router.get("/employee/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const compny=await Compny.findById(id);
    const user =await User.find({});
    // const compny =await Compny.find({});
    res.render("employee",{compny,user,home:req.user});
}));


router.get("/admindelete/:id",isLoggedIn,isAdmin, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedProduct = await Compny.findByIdAndDelete(id);
    req.flash("success", "Company Deleted");
    res.redirect("/compny/listed");
}));
router.get("/tech/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    const{id}=req.params;
    const compny=await Compny.findById(id);
    res.render("showcompny",{compny,home:req.user});
}));

router.get("/show",isLoggedIn,wrapAsync(async(req,res)=>{
const compny=  await Compny.find({});
 res.render("index.ejs",{compny, home:req.user});
}));
router.get("/createcompny",isLoggedIn,wrapAsync(async(req,res)=>{
    res.render("createCompny",{home:req.user});
}));
router.get("/fillup",isLoggedIn,wrapAsync(async(req,res)=>{
    res.render("fillCompny",{home:req.user});
}));
router.post("/added",upload.single("logo"), wrapAsync(async(req,res)=>{
     const compny=new Compny(req.body);
     compny.logo= req.file.filename;
     await compny.save();
     res.redirect("/");
}));
module.exports=router;