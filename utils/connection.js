const mysql = require('mysql2');
const util = require('util');
require('dotenv').config();


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'rootroot',
    database: "employeesDB"
})

db.query = util.promisify(db.query);

module.exports = db;