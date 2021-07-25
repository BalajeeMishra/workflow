const express = require("express");
const router = express.Router();
const User = require("../models/user");
const AppError = require("../controlError/AppError");
const wrapAsync = require("../controlError/wrapasync");
const passport = require("passport");
const multer = require('multer');
require("./passport_setup");
// const upload = multer({ dest: "public/files" });
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
var email;
var password;
var name;


router.get("/",(req,res)=>{
   res.render("home",{home:req.user})
});

router.get("/profile",(req,res)=>{
  res.render("profile",{home:req.user});
})

router.get("/addmoreinformation",(req,res)=>{
    res.render("registerone");

});


router.post("/register/user",async(req,res)=>{
    name=req.session.name=req.body.name;
    email=req.session.email=req.body.email;
    password=req.session.password=req.body.password;
    res.redirect("/addmoreinformation");
});
router.get("/register", wrapAsync(async (req, res, next) => {
    res.render("register");
}));

router.post("/registered",upload.single("logo"), wrapAsync(async(req, res, next) => {
    try {
        const {age, compny} = req.body;
        const user = new User({ name,username:email,age,compny,logo:req.file.filename});
        const registeredUser =  await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome here!');
            res.redirect("/compny/show");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }

}))


router.get("/login", (req, res) => {
    res.render("login");
});
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    })

    router.get('/google',
    passport.authenticate('google', { scope:
        ['email', 'profile'] }
  ));
   
  router.get('/google/callback',
      passport.authenticate( 'google', {
          successRedirect: '/compny/show',
          function(req,res) {
              req.flash("error","something went wrong");
              res.redirect("/register");
          }
  }));

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "GoodBye!");
    res.redirect("/");
});
module.exports = router;