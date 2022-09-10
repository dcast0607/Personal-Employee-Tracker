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
};

const addEmployee = (first_name, last_name, role_id, manager_id) => {
    return db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id});`);
;}

const updateExistingEmployeeRole = (employee_id, role_id) => {
    return db.query(
        `
        UPDATE employee SET role_id = ${role_id} WHERE employee.id = ${employee_id}
        `);
};

const updateExistingEmployeeManager = (employee_id, manager_id) => {
    return db.query(
        `
        UPDATE employee SET manager_id = ${manager_id} WHERE employee.id = ${employee_id}
        `);
};

const fetchAllEmployeesByManager = (manager_id) => {
    return db.query(
        `
        SELECT * FROM employee WHERE employee.manager_id = ${manager_id}
        `
    )
};

const fetchAllEmployeesByDepartment = (department_id) => {
    return db.query(
        `
        SELECT employee.id AS employeeID, employee.first_name, employee.last_name, department.id AS departmentID, department.name AS department
        FROM employee
        LEFT JOIN role ON role_id = role.id
        LEFT JOIN department ON department_id = department.id
        WHERE department.id = ${department_id};
        `
    )
};

const deleteDatabaseEntry = (entity_name, entry_id) => {
    return db.query(
        `
        DELETE FROM ${entity_name} WHERE ${entity_name}.id = ${entry_id} 
        `
    )
};

const fetchDepartmentBudget = (department_id) => {
    return db.query(
        `
        SELECT employee.id AS employeeID, employee.first_name, employee.last_name, department.id AS departmentID, department.name AS department, role.salary AS salary
        FROM employee
        LEFT JOIN role ON role_id = role.id
        LEFT JOIN department ON department_id = department.id
        WHERE department.id = ${department_id}; 
        `
    )
};

const fetchEmployeeAndRolesTables = () => {
    return db.query(`
    SELECT employee.id AS employeeID, employee.first_name, employee.last_name, employee.manager_id, role.title AS role, role.salary, role.id AS role_id, role.department_id
    FROM employee
    LEFT JOIN role ON role_id = role.id
    `);
};



module.exports = {
    fetchAllDepartments,
    fetchAllRoles,
    fetchAllEmployees, 
    addDepartment,
    addRole,
    addEmployee,
    updateExistingEmployeeRole,
    updateExistingEmployeeManager,
    fetchAllEmployeesByManager,
    fetchAllEmployeesByDepartment,
    deleteDatabaseEntry,
    fetchDepartmentBudget,
    fetchEmployeeAndRolesTables
};