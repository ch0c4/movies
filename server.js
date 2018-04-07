"use strict"

var config = require('config');
var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(router.use("/api/v1/movie", require('./routes/movie')));

app.listen(config.get('port'), () => {
    console.log("Server listen " + config.get('port'));
});

module.exports = app;