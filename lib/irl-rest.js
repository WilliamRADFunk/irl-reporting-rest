var privateClient = require('./authenticated-client').authedClient;

var api = {};

api.getTodayData = function(date) {
    return privateClient.getTodayData(date);
};
api.postScentData = function(params) {
    return privateClient.postScentData(params);
};
module.exports.api = api;