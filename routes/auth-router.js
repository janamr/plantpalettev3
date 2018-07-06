const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model.js");


// <---------- SIGN UP ---------------->

authRoutes.get("/signup", (req, res, next) => {
    res.render("auth-views/signUp-form.hbs");
})

authRoutes.post("/process-signup", (req, res, next) => {
    //res.send(req.body)
    const userName = req.body.userName;
    const email = req.body.email;
    const profession = req.body.profession;
    let encryptedPassword;


    if(req.body.password === ""){
        req.flash("error", "Please enter a valid password!");
        res.redirect("/signup");
        return
    } else {
        encryptedPassword = bcrypt.hashSync(req.body.password, 10);
    }

    User.create({ userName, email, profession, encryptedPassword})
    .then((users) => {
        console.log("data saved to DB!");
        req.flash("sucess", "You have logged in!");
        res.redirect("/");
    })
    .catch((err) => {
        next(err);
    })
})


// <--------------LOG IN -------------------------->

authRoutes.get("/login", (req, res, next) => {
    res.render("auth-views/logIn-form.hbs")
})

authRoutes.post("/process-login", (req, res, next) => {
    //res.send(req.body);
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then((user) => {
        if (!user){
            req.flash("error", "Please enter a valid email address!");
            res.redirect("/login");}
        else {
            const {encryptedPassword} = user;

            if (!bcrypt.compareSync(password, encryptedPassword)){
                req.flash("error", "Password doesn't match, please re-enter!");
                res.redirect("/login");
                return;
            } else {
                req.login(user, () => {
                    req.flash("sucess", "You have logged in successfully!");
                    console.log("=================");
                    console.log("You have logged in!")
                    res.redirect("/center")
                })
                }
            }
    })
    .catch((err) => {next(err)})
})

// <-------------- LOG OUT------------------------>
authRoutes.get("/logout", (req, res, next) => {
    req.logout();
    console.log("You have logged out!");
    req.flash("sucess", "You have logged out successfully!");
    res.redirect("/");
})



// <------------------ SETTING ------------------->
authRoutes.get("/settings", (req, res, next) => {
    if(!req.user){
        req.flash('error','Please log in');
        res.redirect("/login");
      } else {
    res.render("auth-views/settings.hbs")
      }
})

authRoutes.post("/change-username", (req, res, next) =>{
    const newName = req.body.userName;
    const userID = req.user._id;

    User.findById(userID, function (err, user) {
        if (err) next(err);

        user.userName = newName;
        user.save(function (err, updatedUser) {
          if (err) next(err);
          req.flash('sucess','User name is updated!');
          console.log("User name update successfully!!");
          res.redirect("/center")
        });
      });
})

authRoutes.post("/change-password", (req, res, next) => {
    const newPassword = req.body.password;
    const newEncryptedPass = bcrypt.hashSync(newPassword, 10)
    const oldPassword = req.user.encryptedPassword;
    const userID = req.user._id;

    //res.send(oldPassword);

    // if new and old password match
  if(!bcrypt.compareSync(oldPassword, newEncryptedPass)){

    User.findById(userID, function (err, user) {
        if (err) next(err);

        user.encryptedPassword  = newEncryptedPass;
        user.save(function (err, updatedUser) {
          if (err) next(err);
          req.flash('sucess','Password is updated!');
          res.redirect("/")
        });
      });
    } else {
        res.redirect("/settings")
    }
})

// <---------------------- OAuth Authentification ---------------------------->

// Allow Google log in here
authRoutes.get("/google/login",
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/plus.profile.emails.read"
          ]
    }));

authRoutes.get("/google/success", passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
    successFlash: "Google log in success!",
    failureFlash: "Google log in failure!."
}) );



// <------------- Export AuthRoutes -----------------
module.exports= authRoutes;