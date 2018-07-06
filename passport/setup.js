const passport = require("passport");
const User = require("../models/user-model.js");
const flash = require("connect-flash");


// GOOGLE LOG IN
require("./google-strategy.js");


passport.serializeUser((userDoc, done) => {
    console.log("SERIALIZE (save to session)");
    done(null, userDoc._id)
});

passport.deserializeUser((idFromSession, done) =>{
    console.log("deSERIALIZE (details from the database)");

    User.findById(idFromSession)
        .then((userDoc) => {
            done(null, userDoc);
        })
        .catch((err) => {
            done(err);
        });

})

function passportSetup (app) {
        app.use(passport.initialize());
        app.use(passport.session());

        app.use((req, res, next) => {
            res.locals.logInUser = req.user;
            //res.locals.messages = req.flash();

            next();
        })
    }


module.exports = passportSetup;