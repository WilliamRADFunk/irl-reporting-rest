var bodyParser = require("body-parser");
var privateClient = require('./authenticated-client').authedClient;
const allowedDomains = ['http://localhost:4200/*', 'http://www.williamrobertfunk.com/*', '*'];
const allowedScents = ['sewage', 'fishy', 'stale', 'sulfur', 'peppery', 'trash'];
const allowedVeg = ['dead', 'wilting', 'rotting'];
const lngFrom = 80.186119;
const lngTo = 80.850792;
const latFrom = 27.116328;
const latTo = 28.793384;

const appRouter = function (app) {
    // Needed to pull params out of a PUT request object with JSON params.
    app.use(bodyParser.json());
    // Handles the empty landing scenario.
    app.get("/", function(req, res) {
        res.status(200).send({ message: "Welcome to our restful API"});
    });
    // Adds a new observation to the scent table.
    app.put("/observation/scent/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (!hasLocation(params.latitude, params.longitude) || !hasValue(params.observation)) {
            res.status(401).send({ message: 'Parameters incomplete'});
        }
        // Handle the response
        privateClient.postScentData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the water_clarity table.
    app.put("/observation/water-clarity/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (!hasLocation(params.latitude, params.longitude) || !isNumber(num)) {
            res.status(401).send({ message: 'Parameters incomplete'});
        }
        // Handle the response
        privateClient.postWaterClarityData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the vegetation table.
    app.put("/observation/vegetation/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || !hasValue(params.observation)) {
            res.status(401).send({ message: 'Parameters incomplete'});
        }
        // Handle the response
        privateClient.postVegetationData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the algae table.
    app.put("/observation/algae/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || params.observation || 
            !hasValue(params.observation.color) || !hasValue(params.observation.onShore)) {
            res.status(401).send({ message: 'Parameters incomplete'});
        }
        // Handle the response
        privateClient.postAlgaeData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Gets all data in a period of 24 hours.
    app.get("/data/today", function (req, res) {
        // Handle the response
        resolveGet(res, 24);
    });
    // Gets all data in a period of 7 days.
    app.get("/data/week", function (req, res) {
        // Handle the response
        resolveGet(res, 168);
    });
    // Gets all data in a period of 1 month.
    app.get("/data/month", function (req, res) {
        // Handle the response
        resolveGet(res, 720);
    });
};
function randomLocation() {
    const longitude = (Math.random() * (lngTo - lngFrom) + lngFrom).toFixed(6) * -1;
    var latitude;
    do {
        latitude = (Math.random() * (latTo - latFrom) + latFrom).toFixed(6) * 1;
    } while (!latChecker(latitude));
    return [latitude, longitude];
}
/**
 * Receives error and results, handling the response accordingly.
 * @param {*} error returned error value
 * @param {*} results returned results value
 * @param {*} res PUT response object
 */
function handlePutResults(error, results, res) {
    if (error) {
        res.status(error.status).send(error);
    }
    res.status(200).send(results);
}
/**
 * Tests for not null and nut undefined.
 * @param {*} thing variable in question
 */
function hasValue(thing) {
    return undefined !== thing && thing !== null;
};
/**
 * Tests for valid location values
 * @param {test} lat latitude
 * @param {*} lng longitude
 */
function hasLocation(lat, lng) {
    return !isNaN(Number(lat)) && !isNaN(Number(lng));
};
/**
 * Tests for valid number value.
 * @param {*} num the possible number
 */
function isNumber(num) {
    return !isNaN(Number(num)) && num !== null;
};
/**
 * Calls the authenticated service with datetime bounds to get all the data in range.
 * @param {*} start left bound for datetime query search of data.
 * @param {*} end right bound for datetime query search of data.
 * @param {*} cb callback function for data fetch to use when query finishes.
 */
function getData(start, end, cb) {
    privateClient.getData(start, end, cb);
};
/**
 * Pulls out the relevant params from the request,
 * and sets Access-Control-Allow-Origin on response
 * @param {*} req PUT request object
 * @param {*} res PUT response object
 */
function getParams(req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    var params = {};
    params.latitude = req.body.latitude;
    params.longitude = req.body.longitude;
    params.observation = req.body.observation;
    return params;
};
/**
 * Calculates the left and right datetime bounds for query search.
 * @param {*} hours number of hours start date time should be in the past.
 */
function getStartEndDateTimes(hours) {
    var now = new Date();
    var end = new Date();
    var start = new Date(now.setHours((end.getHours() - hours)));
    start = start.toISOString().replace('T', ' ').replace('Z', '');
    start = start.substring(0, start.indexOf('.'));
    end = end.toISOString().replace('T', ' ').replace('Z', '');
    end = end.substring(0, end.indexOf('.'));
    return [start, end];
};
/**
 * Checks if the entered latitude is within the acceptable range to be in the Lagoon.
 * @param {*} lat latitude
 */
function latChecker(lat) {
    const long = ((0.0376598 * -1) * ( lat * lat)) + (1.70902 * lat) - 98.8370;
    return long <= -80.186119 && long >= -80.850792;
}
/**
 * Resolves any data get call, flexible by passed in hour range.
 * @param {*} res resolution param object passed in by callback function.
 * @param {*} hours number of hours start date time should be in the past.
 */
function resolveGet(res, hours) {
    const bounds = getStartEndDateTimes(hours);
    res.set('Access-Control-Allow-Origin', '*');
    getData(bounds[0], bounds[1], function(error, results) {
        if (error) { res.status(error.status).send(error); }
        res.status(200).send(results);
    });
};
function postMicroorganismData(params, cb) {
    privateClient.postMicroorganismData(params, cb);
};
function postDeadFishData(params, cb) {
    privateClient.postDeadFishData(params, cb);
};
function postDeadAnimalsData(params, cb) {
    privateClient.postDeadAnimalsData(params, cb);
};
function postGarbageData(params, cb) {
    privateClient.postGarbageData(params, cb);
};
function postHealthEffectsData(params, cb) {
    privateClient.postHealthEffectsData(params, cb);
};
function postOtherData(params, cb) {
    privateClient.postOtherData(params, cb);
};

// Spawn scent observations
// (function createTestScents() {
//     for (var i = 0; i < 1; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         finalParams.observation = allowedScents[Math.floor(Math.random() * 5 )];
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         finalParams.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postScentData(params, function(error, results) {});
//     }
// })();

// Spawn water clarity observations
// (function createTestWaterClarities() {
//     for (var i = 0; i < 1000; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         params.observation = Math.random();
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postWaterClarityData(params, function(error, results) {});
//     }
// })();

// Spawn vegetation observations
// (function createTestVegetations() {
//     for (var i = 0; i < 1000; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         params.observation = allowedVeg[Math.floor(Math.random() * 2 )];
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postVegetationData(params, function(error, results) {});
//     }
// })();

module.exports = appRouter;