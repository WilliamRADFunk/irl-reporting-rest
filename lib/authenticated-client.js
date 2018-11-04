var fs = require('fs');
var mysql = require('mysql');

var permissions = JSON.parse(fs.readFileSync('./config/permissions.json', 'utf8'));
const password = permissions.password;
const user = permissions.user;
const host = permissions.host;
const database = permissions.database;

var connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
});

connection.connect(function(err) { console.log('Connection error: ', err); });
 
const authedClient = {};
authedClient.getData = function(start, end, cb) {
  const query = 'SELECT * FROM scent WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Data Get Error: ', error);
      cb(error);
    } else {
      console.log('Data Get: ', results);
      cb(null, results);
    }
  });
};

authedClient.postScentData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  const obs = params.observation;
  // TODO: Delete reportedDateTime once enough fake data exists.
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO scent (latitude, longitude, observation, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', "' + obs + '", "' + dat + '");';
  const query = 'INSERT INTO scent (latitude, longitude, observation) ' + 
    'VALUES (' + lat + ', ' + lng + ', "' + obs + '");';

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Scent Data Error: ', error);
      cb(error);
    } else {
      console.log('Scent Data: ', results);
      cb(null, results);
    }
  });
};

authedClient.postWaterClarityData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  const obs = params.observation;
  // TODO: Delete reportedDateTime once enough fake data exists.
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO water_clarity (latitude, longitude, observation, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', ' + obs + ', "' + dat + '");';
  const query = 'INSERT INTO water_clarity (latitude, longitude, observation) ' + 
    'VALUES (' + lat + ', ' + lng + ', ' + obs + ');';

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Water Clarity Data Error: ', error);
      cb(error);
    } else {
      console.log('Water Clarity Data: ', results);
      cb(null, results);
    }
  });
};

authedClient.postVegetationData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  const obs = params.observation;
  // TODO: Delete reportedDateTime once enough fake data exists.
  var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  dat = dat.substring(0, dat.indexOf('.'));
  const query = 'INSERT INTO vegetation (latitude, longitude, observation, reportedDateTime) ' + 
    'VALUES (' + lat + ', ' + lng + ', "' + obs + '", "' + dat + '");';
  // const query = 'INSERT INTO vegetation (latitude, longitude, observation) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', "' + obs + '");';

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Vegetation Data Error: ', error);
      cb(error);
    } else {
      console.log('Vegetation Data: ', results);
      cb(null, results);
    }
  });
};

// authedClient.postAlgaeData = function(params, cb) {
//   const lat = params.latitude;
//   const lng = params.longitude;
//   const obs = params.observation;
//   // TODO: Delete reportedDateTime once enough fake data exists.
//   var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
//   dat = dat.substring(0, dat.indexOf('.'));
//   const query = 'INSERT INTO vegetation (latitude, longitude, color, onShore, reportedDateTime) ' + 
//     'VALUES (' + lat + ', ' + lng + ', "' + obs.color +
//     '", "' + !!obs.onShore + '", "' + dat + '");';
//   // const query = 'INSERT INTO vegetation (latitude, longitude, color, onShore, reportedDateTime) ' + 
//   // 'VALUES (' + lat + ', ' + lng + ', "' + obs.color +
//   // '", "' + !!obs.onShore + ');';

//   console.log('query:', query);

//   connection.query(query, function(error, results) {
//     if (error) {
//       console.log('Vegetation Data Error: ', error);
//       cb(error);
//     } else {
//       console.log('Vegetation Data: ', results);
//       cb(null, results);
//     }
//   });
// };

module.exports.authedClient = authedClient;