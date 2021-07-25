 const passport = require("passport");
 const User = require("../models/user");
 var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

 passport.use(new GoogleStrategy({
     clientID:    "380430391689-v68digbmb23qq7ng78j5lth285khurq0.apps.googleusercontent.com",
     clientSecret: "LkAMlBqu8q68SnOrWzU02P5D",
     callbackURL: "http://localhost:3000/google/callback",
     passReqToCallback   : true
   },
   async(request, accessToken, refreshToken, profile, done)=> {
     console.log(profile);
    const newUser = {
      googleId : profile.id,
      name : profile.displayName,
      firstName : profile.name.givenName,
      lastName: profile.name.familyName,
      logo : profile.photos[0].value,
      compny:"lori health",
      age:"20",
      username:profile.email
    }
    try{
      const user= await User.findOne({ googleId: profile.id });
      if(user){
        done(null,user)
      }
      else{
       const user= await User.create(newUser)
        done(null,user);
      }
    }
    catch(err) {
        console.log(err);
    }

   }
 ));

   