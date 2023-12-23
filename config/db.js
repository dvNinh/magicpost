var mysql = require('mysql2');

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "magicpost"
}).promise();

module.exports = pool;