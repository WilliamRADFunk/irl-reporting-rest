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
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO vegetation (latitude, longitude, observation, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', "' + obs + '", "' + dat + '");';
  const query = 'INSERT INTO vegetation (latitude, longitude, observation) ' + 
    'VALUES (' + lat + ', ' + lng + ', "' + obs + '");';

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

authedClient.postAlgaeData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  const color = params.observation.color;
  const onShore = params.observation.onShore;
  // TODO: Delete reportedDateTime once enough fake data exists.
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO algae (latitude, longitude, color, onShore, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', "' + color +
  //   '", ' + (!!onShore ? 1 : 0) + ', "' + dat + '");';
  const query = 'INSERT INTO algae (latitude, longitude, color, onShore, reportedDateTime) ' + 
  'VALUES (' + lat + ', ' + lng + ', "' + color + '", ' + (!!onShore ? 1 : 0) + ');';

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Algae Data Error: ', error);
      cb(error);
    } else {
      console.log('Algae Data: ', results);
      cb(null, results);
    }
  });
};

authedClient.postMicroorganismsData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  // TODO: Delete reportedDateTime once enough fake data exists.
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO microorganisms (latitude, longitude, observation, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', 1, "' + dat + '");';
  const query = 'INSERT INTO microorganisms (latitude, longitude, observation) ' + 
    'VALUES (' + lat + ', ' + lng + ', 1);';

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Microorganisms Data Error: ', error);
      cb(error);
    } else {
      console.log('Microorganisms Data: ', results);
      cb(null, results);
    }
  });
};

authedClient.postDeadFishData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  const obs = params.observation;
  // TODO: Delete reportedDateTime once enough fake data exists.
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO dead_fish (latitude, longitude, observation, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', ' + obs + ', "' + dat + '");';
  const query = 'INSERT INTO dead_fish (latitude, longitude, observation) ' + 
    'VALUES (' + lat + ', ' + lng + ', ' + obs + ');';

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Dead Fish Data Error: ', error);
      cb(error);
    } else {
      console.log('Dead Fish Data: ', results);
      cb(null, results);
    }
  });
};

authedClient.postDeadAnimalsData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  const type = params.observation.type;
  const quantity = params.observation.quantity;
  // TODO: Delete reportedDateTime once enough fake data exists.
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO dead_animals (latitude, longitude, type, quantity, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', "' + type + '", ' + quantity + ', "' + dat + '");';
  const query = 'INSERT INTO dead_animals (latitude, longitude, type, quantity) ' + 
    'VALUES (' + lat + ', ' + lng + ', "' + type + '", ' + quantity + ');'

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Dead Animals Data Error: ', error);
      cb(error);
    } else {
      console.log('Dead Animals Data: ', results);
      cb(null, results);
    }
  });
};

authedClient.postGarbageData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  const type = params.observation.type;
  const quantity = params.observation.quantity;
  // TODO: Delete reportedDateTime once enough fake data exists.
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO garbage (latitude, longitude, type, quantity, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', "' + type + '", "' + quantity + '", "' + dat + '");';
  const query = 'INSERT INTO garbage (latitude, longitude, type, quantity) ' + 
    'VALUES (' + lat + ', ' + lng + ', "' + type + '", "' + quantity + '");'

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Garbage Data Error: ', error);
      cb(error);
    } else {
      console.log('Garbage Data: ', results);
      cb(null, results);
    }
  });
};

authedClient.postHealthEffectsData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  const type = params.observation.type;
  const severity = params.observation.severity;
  // TODO: Delete reportedDateTime once enough fake data exists.
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO health_effects (latitude, longitude, type, severity, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', "' + type + '", "' + severity + '", "' + dat + '");';
  const query = 'INSERT INTO health_effects (latitude, longitude, type, severity) ' + 
    'VALUES (' + lat + ', ' + lng + ', "' + type + '", "' + severity + '");'

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Health Effects Data Error: ', error);
      cb(error);
    } else {
      console.log('Health Effects Data: ', results);
      cb(null, results);
    }
  });
};

authedClient.postOtherData = function(params, cb) {
  const lat = params.latitude;
  const lng = params.longitude;
  const obs = params.observation;
  // TODO: Delete reportedDateTime once enough fake data exists.
  // var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  // dat = dat.substring(0, dat.indexOf('.'));
  // const query = 'INSERT INTO other (latitude, longitude, observation, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', "' + obs + '", "' + dat + '");';
  const query = 'INSERT INTO other (latitude, longitude, observation) ' + 
    'VALUES (' + lat + ', ' + lng + ', "' + obs + '");'

  console.log('query:', query);

  connection.query(query, function(error, results) {
    if (error) {
      console.log('Other Data Error: ', error);
      cb(error);
    } else {
      console.log('Other Data: ', results);
      cb(null, results);
    }
  });
};

module.exports.authedClient = authedClient;