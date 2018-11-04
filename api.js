var express = require("express");
var routes = require("./lib/routes.js");
var cors = require('cors');
var app = express();

app.use(cors());
routes(app);

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});