'use strict';

const express       = require('express');
const bodyParser    = require('body-parser');
const fccTesting    = require('./freeCodeCamp/fcctesting.js');
const pug           = require('pug');
const app           = express();
const mongo         = require('mongodb').MongoClient;

const passport       = require('passport');

const routes = require('./routes.js');
const auth   =   require("./auth.js");


fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

 
// {useNewUrlParser: true, useUnifiedTopology: true},
mongo.connect(process.env.DATA_BASE, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  let db = client.db('myprojet');
  
  if (err){
    console.log('Database'+ err);
  } else {
    console.log('Successful database connection');
    
    auth(app, db);
    routes(app, db);
    
    app.use((req, res, next) => {
      res.status(404)
        .type("text")
        .send('Not Found');
    });
    
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });

  }
});















