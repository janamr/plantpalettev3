const express = require("express");
const mongoose = require("mongoose");
const projectRoutes = express.Router();
const Project = require("../models/project-model.js");

// <------- USER CENTER------->
projectRoutes.get("/center", (req, res, next) => {

  if(!req.user){
    req.flash('error','Please log in first');
    res.redirect("/login");
  } else {
    const userID = req.user._id;
    Project.find({userID: userID}).sort({createdAt: -1})   // ----> sort by creation time
    .then(projects => {
      res.render("project-views/user-center.hbs", {projects})
    })
    .catch((err) => {next(err)})
  }
});


// <--------- CREATE A PROJECT ---------->

projectRoutes.get("/project/create", (req, res, next) => {
  if(!req.user){
    req.flash('error','Please log in first');
    res.redirect("/login");
  } else {
    res.render("project-views/create-project.hbs");
  }
});

projectRoutes.post("/process-creation", (req, res, next) => {
  const projectName = req.body.proName;
  const projectDescription = req.body.proDescription;
  const location = req.body.proLocation;
  const userID = req.user._id;

  // name and location of the project cannot be empty
  if(projectName ==="" || location ===""){
    req.flash('error','Fields with * cannot be empty!');
    res.redirect("/project/create")
  } else {

    Project.create({projectName, projectDescription, location, userID})
    .then((project) => {
      console.log("==================");
      console.log(projectName + " is saved to projects database! ");
      res.redirect("/center");
    })
    .catch((err) => {
      next(err);
    })
  }
})


// <----------- Remove a project ------------>
projectRoutes.get("/project/:id/delete", (req, res, next) => {
  const project_id = req.params.id;
  Project.findByIdAndRemove(project_id)
    .then((project) => {
      console.log("Project is deleted successfully!");
      res.redirect("/center");
    })
    .catch((err) => {
      next(err);
    })
})


// <------------ One project details ---------->
projectRoutes.get("/project/:id", (req, res, next) => {
  const project_id = req.params.id;

  if(!req.user){
    res.redirect("/login");
  } else {
    Project.findById(project_id)
      .populate('plantArray')
      .then((project) => {
        res.locals.project = project;
        res.render("project-views/project-details.hbs", {project})
  })
      .catch((err) => {next(err)})
  }
})


module.exports= projectRoutes;