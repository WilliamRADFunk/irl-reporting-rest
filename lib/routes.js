var bodyParser = require('body-parser');
var privateClient = require('./authenticated-client').authedClient;
const allowedDomains = ['http://localhost:4200/*', 'http://www.williamrobertfunk.com/*', '*'];
const allowedScents = ['sewage', 'fishy', 'stale', 'sulfur', 'peppery', 'trash'];
const allowedVeg = ['dead', 'wilting', 'rotting'];
const allowedAlgae = ['green', 'brown', 'red'];
const allowedAnimals = ['pelicans', 'seagulls', 'crabs', 'dolphins', 'manatees', 'other'];
const allowedGarbage = ['plastic', 'paper', 'metal', 'mixed', 'other'];
const allowedQuant = ['little', 'medium', 'alot'];
const allowedHealth = ['cough', 'eyes-watery', 'eyes-itchy', 'eyes-blurry', 'breathing', 'heart', 'other'];
const allowedSeverity = ['mild', 'moderate', 'severe'];
const lngFrom = 80.186119;
const lngTo = 80.850792;
const latFrom = 27.116328;
const latTo = 28.793384;
const catsumIpsum = "Chill on the couch table it's 3am, time to create some chaos , claw at curtains stretch and yawn nibble on tuna ignore human bite human hand. Dead stare with ears cocked eat too much then proceed to regurgitate all over living room carpet while humans eat dinner lies down purr yet if it fits, i sits plays league of legends. Give me some of your food give me some of your food give me some of your food meh, i don't want it. Milk the cow open the door, let me out, let me out, let me-out, let me-aow, let meaow, meaow! rub against owner because nose is wet. Hiding behind the couch until lured out by a feathery toy climb a tree, wait for a fireman jump to fireman then scratch his face and gnaw the corn cob lie on your belly and purr when you are asleep and furrier and even more furrier hairball. Fall asleep on the washing machine chase red laser dot. Need to check on human, have not seen in an hour might be dead oh look, human is alive, hiss at human, feed me adventure always fall asleep on the washing machine for meoooow. When in doubt, wash scratch me there, elevator butt kitty loves pigs, but if human is on laptop sit on the keyboard sweet beast use lap as chair, or bite nose of your human. Always ensure to lay down in such a manner that tail can lightly brush human's nose asdflkjaertvlkjasntvkjn (sits on keyboard). Lick butt and sometimes switches in french and say 'miaou' just because well why not, or howl uncontrollably for no reason. Lick plastic bags mice mrow who's the baby, so my water bowl is clean and freshly replenished, so i'll drink from the toilet. Cough furball into food bowl then scratch owner for a new one ptracy, yet eat the rubberband, for lick the curtain just to be annoying eat too much then proceed to regurgitate all over living room carpet while humans eat dinner yet chase dog then run away you are a captive audience while sitting on the toilet, pet me. Get suspicious of own shadow then go play with toilette paper furrier and even more furrier hairball for scratch the box yet the fat cat sat on the mat bat away with paws or sleep so i can haz. Scratch the box pushes butt to face or fight an alligator and win. Drink water out of the faucet purr when being pet yet meow go back to sleep owner brings food and water tries to pet on head, so scratch get sprayed by water because bad cat destroy the blinds. Russian blue scratch at fleas, meow until belly rubs, hide behind curtain when vacuum cleaner is on scratch strangers and poo on owners food purr. Stand with legs in litter box, but poop outside hunt anything that moves, or show belly. Immediately regret falling into bathtub step on your keyboard while you're gaming and then turn in a circle yet chew foot. Have secret plans. Knock over christmas tree refuse to drink water except out of someone's glass pounce on unsuspecting person hiiiiiiiiii feed me now jumps off balcony gives owner dead mouse at present then poops in litter box snatches yarn and fights with dog cat chases laser then plays in grass finds tiny spot in cupboard and sleeps all day jumps in bathtub and meows when owner fills food dish the cat knocks over the food dish cat slides down the water slide and into pool and swims even though it does not like water. Cereal boxes make for five star accommodation . Purr like an angel making sure that fluff gets into the owner's eyes so refuse to drink water except out of someone's glass for pet me pet me don't pet me but lay on arms while you're using the keyboard and sniff all the things.";

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
        privateClient.postScentData(params, function(error, results) {
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
        privateClient.postWaterClarityData(params, function(error, results) {
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
        privateClient.postVegetationData(params, function(error, results) {
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
        privateClient.postAlgaeData(params, function(error, results) {
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
        privateClient.postMicroorganismData(params, function(error, results) {
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
        privateClient.postDeadFishData(params, function(error, results) {
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
        privateClient.postDeadAnimalsData(params, function(error, results) {
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
        privateClient.postGarbageData(params, function(error, results) {
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
        privateClient.postHealthEffectsData(params, function(error, results) {
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
        privateClient.postOtherData(params, function(error, results) {
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
 * Finds a latitude and longitude combination within range of the IRL.
 * @returns [latitude, longitude]
 */
function randomLocation() {
    const longitude = (Math.random() * (lngTo - lngFrom) + lngFrom).toFixed(6) * -1;
    var latitude;
    do {
        latitude = (Math.random() * (latTo - latFrom) + latFrom).toFixed(6) * 1;
    } while (!latChecker(latitude));
    return [latitude, longitude];
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

// Spawn scent observations
// (function createTestScents() {
//     for (var i = 0; i < 1; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         params.observation = allowedScents[Math.floor(Math.random() * 5 )];
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
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

// Spawn algae observations
// (function createTestAlgaes() {
//     for (var i = 0; i < 1000; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         params.observation = {
//             color: allowedAlgae[Math.floor(Math.random() * 2 )],
//             onShore: Math.random() > 0.5
//         };
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postAlgaeData(params, function(error, results) {});
//     }
// })();

// Spawn microorganisms observations
// (function createTestMicroorganisms() {
//     for (var i = 0; i < 500; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         params.observation = true;
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postMicroorganismsData(params, function(error, results) {});
//     }
// })();

// Spawn dead fish observations
// (function createTestDeadFishes() {
//     for (var i = 0; i < 1000; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         params.observation = Math.floor(Math.random() * 100) + 1;
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postDeadFishData(params, function(error, results) {});
//     }
// })();

// Spawn dead animals observations
// (function createTestDeadAnimals() {
//     for (var i = 0; i < 1000; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         params.observation = {
//             type: allowedAnimals[Math.floor(Math.random() * 6 )],
//             quantity: Math.floor(Math.random() * 100) + 1
//         };
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postDeadAnimalsData(params, function(error, results) {});
//     }
// })();

// Spawn garbage observations
// (function createTestGarbage() {
//     for (var i = 0; i < 1000; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         params.observation = {
//             type: allowedGarbage[Math.floor(Math.random() * 4 )],
//             quantity: allowedQuant[Math.floor(Math.random() * 2 )],
//         };
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postGarbageData(params, function(error, results) {});
//     }
// })();

// Spawn health effects observations
// (function createTestHealthEffects() {
//     for (var i = 0; i < 1000; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         params.observation = {
//             type: allowedHealth[Math.floor(Math.random() * 6 )],
//             severity: allowedSeverity[Math.floor(Math.random() * 2 )],
//         };
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postHealthEffectsData(params, function(error, results) {});
//     }
// })();

// Spawn other observations
// (function createTestOther() {
//     for (var i = 0; i < 400; i++) {
//         const location = randomLocation();
//         var params = { latitude: location[0], longitude: location[1] };
//         var startIndex = Math.floor(Math.random() * 200);
//         params.observation = catsumIpsum.substring(startIndex, (startIndex + Math.floor(Math.random() * 300)));
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         params.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         privateClient.postOtherData(params, function(error, results) {});
//     }
// })();

module.exports = appRouter;