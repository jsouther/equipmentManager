var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'XXXXXXXXXX',
  password        : '*******',
  database        : 'XXXXXXXXXXX'
});

module.exports.pool = pool;
