const express = require('express');
const router  = express.Router();
const Plant = require("../models/plant-model.js");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index.hbs');
});

// <--------------- FUSS SEARCH --------------------
router.get("/search", (req, res, next) => {

    // res.send(req.query)
    // return
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');

    Plant.find( {$or:[{commonName:regex},{location:regex},{plantType: regex},{bloomPeriod: regex}]} )
    .limit(10)
    .then(plants => {
        res.render("plant-views/plants.hbs", {plants})
    })
    .catch((err) => {next(err)})

})



// <-------------- DEMO LIST ----------------------

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
