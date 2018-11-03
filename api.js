var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./lib/routes.js");
var cors = require('cors');
var app = express();

app.use(cors());
routes(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});