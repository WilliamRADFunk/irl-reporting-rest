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
 
const dataService = {};
dataService.getData = function(start, end, cb) {
  // Whatever you do...don't look at this monstrosity.
  const data = {};
  const queryScent = 'SELECT * FROM scent WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  const queryWaterClarity = 'SELECT * FROM water_clarity WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  const queryVegetation = 'SELECT * FROM vegetation WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  const queryAlgae = 'SELECT * FROM algae WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  const queryMicro = 'SELECT * FROM microorganisms WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  const queryFish = 'SELECT * FROM dead_fish WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  const queryAnimals = 'SELECT * FROM dead_animals WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  const queryGarbage = 'SELECT * FROM garbage WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  const queryHealth = 'SELECT * FROM health_effects WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  const queryOther = 'SELECT * FROM other WHERE reportedDateTime >= timestamp("' +
    start + '") AND reportedDateTime <= timestamp("' + end + '");';
  console.log('queryScent:', queryScent);
  console.log('queryWaterClarity:', queryWaterClarity);
  console.log('queryVegetation:', queryVegetation);
  console.log('queryAlgae:', queryAlgae);
  console.log('queryMicro:', queryMicro);
  console.log('queryFish:', queryFish);
  console.log('queryAnimals:', queryAnimals);
  console.log('queryGarbage:', queryGarbage);
  console.log('queryHealth:', queryHealth);
  console.log('queryOther:', queryOther);
  // No time for elegance :(
  connection.query(queryScent, function(error, results) {
    if (error) { cb(error); } else {
      data.scent = results;
      connection.query(queryWaterClarity, function(error, results) {
        if (error) { cb(error); } else {
          data.waterClarity = results;
          connection.query(queryVegetation, function(error, results) {
            if (error) { cb(error); } else {
              data.vegetation = results;
              connection.query(queryAlgae, function(error, results) {
                if (error) { cb(error); } else {
                  results.forEach(function(x, i) {
                    const algae = {
                      latitude: x.latitude,
                      longitude: x.longitude,
                      observation: {
                        color: x.color,
                        onShore: x.onShore
                      },
                      reportedDateTime: x.reportedDateTime
                    };
                    results[i] = algae;
                  });
                  data.algae = results;
                  connection.query(queryMicro, function(error, results) {
                    if (error) { cb(error); } else {
                      data.microorganisms = results;
                      connection.query(queryFish, function(error, results) {
                        if (error) { cb(error); } else {
                          data.deadFish = results;
                          connection.query(queryAnimals, function(error, results) {
                            if (error) { cb(error); } else {
                              results.forEach(function(x, i) {
                                const animals = {
                                  latitude: x.latitude,
                                  longitude: x.longitude,
                                  observation: {
                                    type: x.type,
                                    quantity: x.quantity
                                  },
                                  reportedDateTime: x.reportedDateTime
                                };
                                results[i] = animals;
                              });
                              data.deadAnimals = results;
                              connection.query(queryGarbage, function(error, results) {
                                if (error) { cb(error); } else {
                                  results.forEach(function(x, i) {
                                    const garbage = {
                                      latitude: x.latitude,
                                      longitude: x.longitude,
                                      observation: {
                                        type: x.type,
                                        quantity: x.quantity
                                      },
                                      reportedDateTime: x.reportedDateTime
                                    };
                                    results[i] = garbage;
                                  });
                                  data.garbage = results;
                                  connection.query(queryHealth, function(error, results) {
                                    if (error) { cb(error); } else {
                                      results.forEach(function(x, i) {
                                        const health = {
                                          latitude: x.latitude,
                                          longitude: x.longitude,
                                          observation: {
                                            type: x.type,
                                            severity: x.severity
                                          },
                                          reportedDateTime: x.reportedDateTime
                                        };
                                        results[i] = health;
                                      });
                                      data.healthEffects = results;
                                      connection.query(queryOther, function(error, results) {
                                        if (error) { cb(error); } else {
                                          data.other = results;
                                          cb(null, data);
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

dataService.postScentData = function(params, cb) {
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

dataService.postWaterClarityData = function(params, cb) {
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

dataService.postVegetationData = function(params, cb) {
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

dataService.postAlgaeData = function(params, cb) {
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

dataService.postMicroorganismsData = function(params, cb) {
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

dataService.postDeadFishData = function(params, cb) {
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

dataService.postDeadAnimalsData = function(params, cb) {
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

dataService.postGarbageData = function(params, cb) {
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

dataService.postHealthEffectsData = function(params, cb) {
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

dataService.postOtherData = function(params, cb) {
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

module.exports.dataService = dataService;