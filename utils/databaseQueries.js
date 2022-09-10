// We initialize "db" so that we can use it on our query requests.
const db = require('./connection');
 
// We query our database and request to get all data that exists in
// the department table. 
const fetchAllDepartments = () => {
    return db.query(`SELECT * FROM department`);
};

// We query our database and request to get all data that exists
// in the role table.
const fetchAllRoles = () => {
    return db.query(`SELECT * FROM role`);
};

// We query our database and request to get all data that exists
// in the employee table.
const fetchAllEmployees = () => {
    return db.query(`SELECT * FROM employee`);
};

// This function is used to insert data into the department table
// in this particular case we are sending in a department name
// which will create a new entry in the department table.
const addDepartment = (name) => {
    // console.log(name);
    return db.query(`INSERT INTO department (name) VALUES ("${name}");`);

};

// Similar to the request above, we are inserting data into the role table
// in this case, however, we are passing in adding parameters and using those
// values to generate a new role entry in the role table. 
const addRole = (title, salary, department_id) => {
    return db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${salary}, ${department_id});`);
};

// Very much like the request above, we are passing in data and using this data
// to create a new table entry in the employee table. 
const addEmployee = (first_name, last_name, role_id, manager_id) => {
    return db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id});`);
;}

// This function allows us to update an existing employee role record, we are
// passing in an UPDATE request, identifying the employee we want to update
// using it's employee ID and updating this users role by the new ID passed into
//  this function.
const updateExistingEmployeeRole = (employee_id, role_id) => {
    return db.query(
        `
        UPDATE employee SET role_id = ${role_id} WHERE employee.id = ${employee_id}
        `);
};

// Very much like the function above, all we are doing is looking up an existing
// entry on the employee table and then updating this entry with the new 
// manager_id that was passed along to this function by the user. 
const updateExistingEmployeeManager = (employee_id, manager_id) => {
    return db.query(
        `
        UPDATE employee SET manager_id = ${manager_id} WHERE employee.id = ${employee_id}
        `);
};

// This particular function allows us to retrieve database entries in the employees
// table by filtering by a specific manager_id. 
const fetchAllEmployeesByManager = (manager_id) => {
    return db.query(
        `
        SELECT * FROM employee WHERE employee.manager_id = ${manager_id}
        `
    )
};

// This function is one of the more challenging functions to work with, 
// unlike the other functions this is not a singular database request as
// some of these entries exist across multiple tables. Given that this
// is the case, we needed to join a few tables to get the right data that we need.

// You can see that we declare the data that we want on like 84 as well as it's names
// and we request this data from the employee table by joining additional tables and
// filtering the data we need by the department_id. 
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

// This database query identifies the table for which you want to delete the record
// and then it identifies this record by it's id. For example, if we want to remove a
// user from the employee table the request would look something like:
// DELETE FROM employee WHERE employee.id = someID;
const deleteDatabaseEntry = (entity_name, entry_id) => {
    return db.query(
        `
        DELETE FROM ${entity_name} WHERE ${entity_name}.id = ${entry_id} 
        `
    )
};

// I was able to recycle much of the SQL query from the fetchEmployeesByDepartment function
// I cleaned it up a bit by removing a few unnecessary columns. We can use the table that 
// is returned to calculate the budget of said department. 
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

// A few of the inquirer queries that I am using require that we present the user with
// some information so I created a function that could fetch that data for us. This just
// sends back data in which the employee and role tables have been join by the role_id. 
const fetchEmployeeAndRolesTables = () => {
    return db.query(`
    SELECT employee.id AS employeeID, employee.first_name, employee.last_name, employee.manager_id, role.title AS role, role.salary, role.id AS role_id, role.department_id
    FROM employee
    LEFT JOIN role ON role_id = role.id
    `);
};


// Exporting my functions here so that I can use them on the inquirer prompts that I will be presenting
// to the user. 

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