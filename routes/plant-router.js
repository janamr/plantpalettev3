const express = require("express");
const plantRoutes = express.Router();
const User = require("../models/user-model.js");
const Plant = require("../models/plant-model.js");
const Project = require("../models/project-model.js");
const mongoose = require("mongoose");


// <---------- LISTS OF PLANTS -------------------------
plantRoutes.get("/plants", (req, res, next) => {
    Plant.find().sort({_id: -1})
    .limit(25)
    .then(plants => {
        //console.log(plants)
        res.render("plant-views/plants.hbs", {plants})
    })
    .catch((err) => {next(err)})
})

plantRoutes.get("/plants/:id", (req, res, next) => {
    const plant_id = req.params.id;
    //res.send(plant_id)


    Plant.findById(plant_id)
    .then((plant) => {
        //res.send(plant);
        res.locals.plant = plant;
        res.render("plant-views/plant-details.hbs", {plant})
    })
    .catch((err) => {next(err)})
})

// <---------------ADD TO PROJECT-----------------------
plantRoutes.get("/plants/:id/save", (req, res, next) => {

    if(!req.user){
        req.flash('error','Please log in first');
        res.redirect("/login")
    } else {
        const userID = req.user._id;
        Project.find({userID:userID})
            .then(projects => {

                res.locals.plantID = req.params.id;
                res.render("project-views/temp-list-projects.hbs", {projects})
            })
            .catch((err) => {next(err)})
    }
})


plantRoutes.post("/plants/save/:projectID", (req, res, next) => {
    const projectID = req.params.projectID;
    const plantID = req.body.plantID;   // <----- pass in the hidden value

    Project.findByIdAndUpdate(
        projectID,
        { $push: {plantArray: plantID},},
        {new: true}
        )
        .then(
            //req.flash('sucess','plant is saved to project!');
            res.redirect(`/project/${projectID}`)
        )
        .catch((err) => next(err))
})


// <------------ Export plantRoutes ----------------------
module.exports= plantRoutes;