// This file is used to initialize our database connection. We import a few of the
// required packaged to be able to use our SQL database and then we initialize the
// connection. This will help us make queries to our database. 

const mysql = require('mysql2');
const util = require('util');
//require('dotenv').config();


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: 'rootroot',
    database: "employeesDB"
})

db.query = util.promisify(db.query);

module.exports = db;