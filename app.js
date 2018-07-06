require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session     = require("express-session");
const MongoStore  = require("connect-mongo")(session);
const passportSetup = require("./passport/setup.js");
const flash = require("connect-flash");

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/TempPlants', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


//set up partials path for connect-flash
hbs.registerPartials(__dirname + "/views/partials");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// set up session
app.use(session({
  secret: "hello this is the secret",
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));
// set up passport
passportSetup(app);


// set up connect-flash
app.use(flash());

app.locals.title = 'Project - Plant Palette';

// -> LINKING to routes

const index = require('./routes/index');
app.use('/', index);

const authRouter = require("./routes/auth-router");
app.use("/", authRouter);

const plantRouter = require("./routes/plant-router");
app.use("/", plantRouter);

const projectRouter = require("./routes/project-router");
app.use("/", projectRouter);

module.exports = app;
