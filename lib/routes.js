const irlRest = require('./irl-rest').api;
const allowedDomains = ['http://localhost:4200', 'http://www.williamrobertfunk.com', '*'];
const allowedScents = ['sewage', 'fishy', 'stale', 'sulfur', 'peppery', 'trash'];

const appRouter = function (app) {
    app.get("/", function(req, res) {
        res.status(200).send({ message: "Welcome to our restful API"});
    });

    app.post("/observation/scent/submit", function (req, res) {
        var finalParams = {};
        finalParams.latitude = req.body.latitude;
        finalParams.longitude = req.body.longitude;
        finalParams.observation = req.body.observation;

        res.set('Access-Control-Allow-Origin', '*');
        // if (!Object.values(finalParams).every(x => x)) {
        //     res.status(401).send({ message: 'Parameters incomplete'});
        // }
        
        // Handle the response
        const result = postScentData(finalParams);
        res.status(200).send(result);
    });

    app.get("/data/today", function (req, res) {
        var date = new Date();
        date = date.toISOString().split('T')[0]; // Today YYYY-MM-DD
        res.set('Access-Control-Allow-Origin', '*');
        // Handle the response
        const result = getTodayData(date);
        console.log('results: ', result);
        res.status(200).send(result);
    });
};

function getTodayData(date) {
    return irlRest.getTodayData(date);
};
function postScentData(params) {
    return irlRest.postScentData(params);
};

// (function createTestScents() {
//     for (var i = 0; i < 1000; i++) {
//         console.log('hello');
//         const allowedScents = ['sewage', 'fishy', 'stale', 'sulfur', 'peppery', 'trash'];
//         const latChecker = function(x) {
//             const y = ((0.0376598 * -1) * ( x * x)) + (1.70902 * x) - 98.8370;
//             return y <= -80.186119 && y >= -80.850792;
//         }
//         var finalParams = {};
//         finalParams.longitude = (Math.random() * (80.850792 - 80.186119) + 80.186119).toFixed(6) * -1;
//         do {
//             finalParams.latitude = (Math.random() * (28.793384 - 27.116328) + 27.116328).toFixed(6) * 1;
//         } while (!latChecker(finalParams.latitude));
//         finalParams.observation = allowedScents[Math.floor(Math.random() * 5 )];
//         var start = new Date();
//         start = new Date(start.setDate(start.getDate() - 30));
//         finalParams.reportedDateTime = new Date(start.getTime() + Math.random() * ((new Date()).getTime() - start.getTime())).toISOString();
//         const result = postScentData(finalParams);
//         console.log('results: ', result);
//     }
// })();

module.exports = appRouter;