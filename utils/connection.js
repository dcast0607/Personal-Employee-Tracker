const mysql = require('mysql');
const util = require('util');
require('dotenv').config();


const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: 'rootroot',
    database: "employeesDB"
})

db.query = util.promisify(db.query);

module.exports = db;