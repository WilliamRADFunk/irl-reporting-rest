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
authedClient.getTodayData = function(date) {
  const query = 'SELECT * FROM scent WHERE reportedDateTime >= timestamp("' +
    date + ' 00:00:00") AND reportedDateTime <= timestamp("' + date + ' 23:59:59");';

  connection.query(query,
    function(error, results) {
      if (error) { throw error; }
      console.log('Today Data: ', results);
      return results;
    }
  );
};

authedClient.getWeekData = function(start, end) {
  const query = 'SELECT * FROM scent WHERE reportedDateTime >= unix_timestamp("' +
    start + ' 23:59:59") AND reportedDateTime <= unix_timestamp("' + end + ' 00:00:00");';

  connection.query(query,
    function(error, results) {
    if (error) { throw error; }
    console.log('Week Data: ', results);
    return results;
  });

  connection.end();
};

authedClient.postScentData = function(params) {
  const lat = params.latitude;
  const lng = params.longitude;
  const obs = params.observation;
  var dat = params.reportedDateTime.replace('T', ' ').replace('Z', '');
  dat = dat.substring(0, dat.indexOf('.'));

  // TODO: Delete reportedDateTime once enough fake data exists.
  // const query = 'INSERT INTO scent (latitude, longitude, observation, reportedDateTime) ' + 
  //   'VALUES (' + lat + ', ' + lng + ', "' + obs + '", "' + dat + '");';
  const query = 'INSERT INTO scent (latitude, longitude, observation, reportedDateTime) ' + 
    'VALUES (' + lat + ', ' + lng + ', "' + obs + '");';

  console.log('query:', query);

  connection.query(query,
    function(error, results) {
      if (error) { throw error; }
      console.log('Submitted Scent: ', results);
      return results;
    }
  );
};

module.exports.authedClient = authedClient;