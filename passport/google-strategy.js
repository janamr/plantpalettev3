const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const User = require("../models/user-model.js");



passport.use(new GoogleStrategy({
    // settings for the strategy
    clientID: process.env.google_id,
    clientSecret: process.env.google_secret,
    callbackURL: "/google/success",
    proxy: true
}, (accessToken, refreshToken, profile, done) =>{
    console.log("Google profile ", profile);

    const { id, displayName, emails } = profile;

    // Check if user email exists
    User.findOne({ googleID: id})
        .then((userDoc) => {
            if (userDoc){
                // found same email, just go log in
                done(null, userDoc);
                return;
            }

            // if not found, save to database by creating a new user
            User.create({
            googleID: id,
            userName: displayName,
            email: emails[0].value})
            .then((userDoc) => {done(null, userDoc)})
            .catch((err) => { done(err);})
        })

        .catch((err) => {next(err)})
    }))

