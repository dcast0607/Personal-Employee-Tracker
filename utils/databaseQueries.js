const db = require('./connection');
    
const fetchAllDepartments = () => {
    return db.query(`SELECT * FROM department`);
};

const fetchAllRoles = () => {
    return db.query(`SELECT * FROM role`);
};

const fetchAllEmployees = () => {
    return db.query(`SELECT * FROM employee`);
};

const addDepartment = (name) => {
    // console.log(name);
    return db.query(`INSERT INTO department (name) VALUES ("${name}");`);

};

module.exports = {
    fetchAllDepartments,
    fetchAllRoles,
    fetchAllEmployees, 
    addDepartment
};