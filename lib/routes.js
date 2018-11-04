var bodyParser = require('body-parser');
var dataService = require('./data-service').dataService;
var spawner = require('./spawn-data').spawner;
const allowedDomains = ['http://localhost:4200/*', 'http://www.williamrobertfunk.com/*', '*'];
const allowedScents = ['sewage', 'fishy', 'stale', 'sulfur', 'peppery', 'trash'];
const allowedVeg = ['dead', 'wilting', 'rotting'];
const allowedAlgae = ['green', 'brown', 'red'];
const allowedAnimals = ['pelicans', 'seagulls', 'crabs', 'dolphins', 'manatees', 'other'];
const allowedGarbage = ['plastic', 'paper', 'metal', 'mixed', 'other'];
const allowedQuant = ['little', 'medium', 'alot'];
const allowedHealth = ['cough', 'eyes-watery', 'eyes-itchy', 'eyes-blurry', 'breathing', 'heart', 'other'];
const allowedSeverity = ['mild', 'moderate', 'severe'];

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
        if (!hasLocation(params.latitude, params.longitude) || !hasValue(params.observation) ||
        !contains(allowedScents, params.observation.observation)) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect'});
        }
        // Handle the response
        dataService.postScentData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the water_clarity table.
    app.put("/observation/water-clarity/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (!hasLocation(params.latitude, params.longitude) || !isNumber(params.observation)) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect'});
        }
        // Handle the response
        dataService.postWaterClarityData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the vegetation table.
    app.put("/observation/vegetation/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || !hasValue(params.observation) ||
            !contains(allowedVeg, params.observation.type)) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect'});
        }
        // Handle the response
        dataService.postVegetationData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the algae table.
    app.put("/observation/algae/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || !params.observation || 
            !hasValue(params.observation.color) || !hasValue(params.observation.onShore) ||
            !contains(allowedAlgae, params.observation.color)) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect'});
        }
        // Handle the response
        dataService.postAlgaeData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the microorganisms table.
    app.put("/observation/microorganisms/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || !params.observation) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect'});
        }
        // Handle the response
        dataService.postMicroorganismsData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the dead fish table.
    app.put("/observation/dead-fish/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || !isNumber(params.observation)) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect'});
        }
        // Handle the response
        dataService.postDeadFishData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the dead animals table.
    app.put("/observation/dead-animals/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || !params.observation || 
            !hasValue(params.observation.type) || !isNumber(params.observation.quantity) ||
            !contains(allowedAnimals, params.observation.type)) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect'});
        }
        // Handle the response
        dataService.postDeadAnimalsData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the garbage table.
    app.put("/observation/garbage/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || !params.observation || 
            !hasValue(params.observation.type) || !hasValue(params.observation.quantity) ||
            !contains(allowedGarbage, params.observation.type) ||
            !contains(allowedQuant, params.observation.quantity)) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect'});
        }
        // Handle the response
        dataService.postGarbageData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the health effects table.
    app.put("/observation/health_effects/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || !params.observation || 
            !hasValue(params.observation.type) || !hasValue(params.observation.severity) ||
            !contains(allowedHealth, params.observation.type) ||
            !contains(allowedSeverity, params.observation.severity)) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect or incorrect'});
        }
        // Handle the response
        dataService.postHealthEffectsData(params, function(error, results) {
            handlePutResults(error, results, res);
        });
    });
    // Adds a new observation to the other table.
    app.put("/observation/other/submit", function (req, res) {
        var params = getParams(req, res);
        // Handle invalid params
        if (hasLocation(params.latitude, params.longitude) || !hasValue(params.observation)) {
            res.status(401).send({ message: 'Parameters incomplete or incorrect'});
        }
        // Handle the response
        dataService.postOtherData(params, function(error, results) {
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
function contains(array, value) {
    return array.indexOf(value) > -1;
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
 * Calls the data service with datetime bounds to get all the data in range.
 * @param {*} start left bound for datetime query search of data.
 * @param {*} end right bound for datetime query search of data.
 * @param {*} cb callback function for data fetch to use when query finishes.
 */
function getData(start, end, cb) {
    dataService.getData(start, end, cb);
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
    var start = new Date(now.setHours((now.getHours() - hours)));
    start = start.toISOString().replace('T', ' ').replace('Z', '');
    start = start.substring(0, start.indexOf('.'));
    end = end.toISOString().replace('T', ' ').replace('Z', '');
    end = end.substring(0, end.indexOf('.'));
    return [start, end];
};
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

(function() {
    spawner.spawnEverything();
})();

module.exports = appRouter;