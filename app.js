const session = require('express-session');
const parseurl = require('parseurl');
const expressValidator = require('express-validator');
const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const url = 'mongodb://localhost:27017/snippets';
const ObjectId = require('mongodb').ObjectID;
const express = require('express'),
  mustacheExpress = require('mustache-express'),
  bodyParser = require('body-parser'),
  sequelize = require('sequelize')
  models = require("./models");
const app = express();
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(bodyParser.json());

app.use(expressValidator());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache')
app.use(bodyParser.urlencoded({
  extended: false
}));
let profiles = [{
  username: 'username',
  password: 'password'
}, {
  username: 'sorry',
  password: 'notsorry'
}];

app.use(function(req, res, next) {
  if (req.url === '/login') {
    next();
  } else if (!req.session.login) {
    res.render('login');
  } else {
    next();
  }
})

app.get('/', function(req, res) {
  res.render("index");
})

app.get('/showSnippet', function(req, res) {
  models.Snippets.findAll().then(function(snippets){
    res.render('showSnippet', {snippets: snippets})
  })
})


app.post('/login', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  console.log('username input = ' + username);
  console.log('password input = ' + password);
  for (let i = 0; i < profiles.length; i++) {
    if (username === profiles[i].username && password === profiles[i].password) {
      req.session.login = true;
    }
  }
  if (req.session.login === true) {
    res.render('index');
  } else {
    res.render('login', {
      error: "incorrect username or password"
    })
  }
})

/////////////////////////////////////

app.get('/addSnippet', function(req, res) {
  res.render('addSnippet');
})

app.post('/makeSnippet', function(req, res) {
  let titleVal = req.body.title;
  let codeVal = req.body.code;
  let notesVal = req.body.notes;
  // let languageVal
  // let tagsVal

  console.log(titleVal, codeVal, notesVal);
  const snippet = models.Snippets.build({
    title: titleVal,
    code: codeVal,
    notes: notesVal
  })
  snippet.save().then(function () {
    res.redirect('/showSnippet')
  })
})






















app.listen(3000, function() {
  console.log('WE ARE RUNNING ON http://localhost:3000/.')
});

process.on('SIGINT', function() {
  console.log("\nshutting down");
  const index = require('./models/index')
  index.sequelize.close()

  setTimeout(function() {
    console.log('we are down Captain');
    process.exit(0);
  }, 500)
});
