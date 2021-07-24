require("dotenv").config();
  const express = require("express");
  const path = require("path");
  const mongoose = require("mongoose");
  const session = require("express-session");
  const MongoDBStore = require("connect-mongo");
  const flash = require("connect-flash");
  const AppError = require("./controlError/AppError");
  const methodOverride = require("method-override");
  const passport = require("passport");
  const LocalStrategy = require("passport-local");

  const User = require("./models/user");
  const Users=require("./routes/user");
  const Compny=require("./routes/compny");
  

  const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/workflow";
  
  mongoose
    .connect("mongodb://localhost:27017/workflow", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("connection open");
    })
    .catch((err) => {
      console.log(err);
    });
  
  const app = express();
  
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
//   app.use(express.static(__dirname + "/public"));
  
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.use(express.static(path.join(__dirname, "public")));
  
  // const store = new MongoDBStore({
  //   mongoUrl: "mongodb://localhost:27017/workflow",
  //   secret: "thisshouldbeabettersecret!",
  //   touchAfter: 60
  // });
  
  // store.on("error", function (e) {
  //   console.log("SESSION STORE ERROR", e);
  // });
  
  const sessionConfig = {
    // store,
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true, //because of true here we are able to see cookies with every request.
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };
  app.use(session(sessionConfig));
  app.use(flash());
  
  app.use(passport.initialize());
  app.use(passport.session());
  //passport.use(new LocalStrategy(User.authenticate()));
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, User.authenticate()));
  // passport.serializeUser(User.serializeUser());
  // passport.deserializeUser(User.deserializeUser());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });


  
  
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // res.locals.email= req.user.email;
    // res.locals.password= req.user.password;
    
    next();
  });
  //routes part.
  app.use("/",Users);
  app.use("/compny",Compny);
  
  
  const handleValidationErr = (err) => {
    return new AppError("please fill up all the required field carefully", 400);
  };
  
  app.use((err, req, res, next) => {
    //We can single out particular types of Mongoose Errors:
    if (err.name === "ValidationError") err = handleValidationErr(err);
    next(err);
  });
  
  // app.use((err, req, res, next) => {
  //   const { statusCode = 500, message = "Something went wrong" } = err;
  //   console.log(err);
  //   if (err) {
  //     res.status(statusCode).render("error", { err });
  //   }
  // });
  
  // app.get('*', (req, res, next) => {
  //     res.locals.cart = req.session.cart;
  //     console.log(res.locals.cart)
  //     console.log(req.session.cart)
  //     // res.locals.user = req.user || null;
  //     next();
  // });
  
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log("APP IS LISTENING ON PORT");
  });
  