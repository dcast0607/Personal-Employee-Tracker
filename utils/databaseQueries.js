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

const addRole = (title, salary, department_id) => {
    return db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${salary}, ${department_id});`);
}

const addEmployee = (first_name, last_name, role_id, manager_id) => {
    return db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id});`);
}

module.exports = {
    fetchAllDepartments,
    fetchAllRoles,
    fetchAllEmployees, 
    addDepartment,
    addRole,
    addEmployee
};