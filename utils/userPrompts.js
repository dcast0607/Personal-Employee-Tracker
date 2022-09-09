const inquirer = require('inquirer');
const databaseQueries = require('./databaseQueries');


const userPrompts = () => {

    const fetchDepartments = async() => {
       const departmentsData = await databaseQueries.fetchAllDepartments()
       .then((data) => {
        console.table(data);
        console.log("--------------------------------------------------------");
       })
       .catch((err) => {
         console.log(err);
       });
       navMenu();
    };

    const fetchRoles = async () => {
        const rolesData = await databaseQueries.fetchAllRoles()
        .then((data) => {
            console.table(data);
            console.log("--------------------------------------------------------");
        })
        .catch((err) => {
            console.log(err);
        });
        navMenu();
    };

    const fetchEmployees = async() => {
        const employeesData = await databaseQueries.fetchAllEmployees()
        .then((data) => {
            console.table(data);
            console.log("--------------------------------------------------------");
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const createDepartment = async (departmentName) => {
        if (departmentName) {
            const departmentData = await databaseQueries.addDepartment(departmentName)
            .then(() => {
                console.log("Adding department to database...");
                fetchDepartments();
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            console.log('\x1b[31m%s\x1b[0m', "Whoops, please make sure that you add a department name!");
            navMenu();
        }
    };


    const createDepartmentPrompts = async() => {
        inquirer
        .prompt(
            [
                {
                    type: 'input',
                    name: 'departmentName',
                    message: "Please enter the name of the department you would like to add: "
                }
            ]
        )
        .then((data) => {
            createDepartment(data.departmentName);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const createRole = async(title, salary, department_id) => {

        if (title && salary && department_id) {
            const roleData = await databaseQueries.addRole(title, salary, department_id)
            .then(() => {
                console.log("Adding role to database...");
                fetchRoles();
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            console.log('\x1b[31m%s\x1b[0m', "Whoops you need to make you that you have added a title, salary, and department ID!");
            navMenu();
        }

    };

    const createRolePrompts = async() => {

        const createRoleData = await databaseQueries.fetchAllDepartments()
        .then((data) => {
            console.table(data);
        })
        .then(() => {
            inquirer
            .prompt(
                [
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Please enter the title of the role:  '
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Please enter the salary of the role: '
                    },
                    {
                        type: 'input',
                        name: 'department_id',
                        message: `Please enter a department ID for the role:(You may refer to the table above for the ID) `
                    }
                ]
            )
            .then((data) => {
                createRole(data.title, data.salary, data.department_id);
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
        });
    };

    // TODO: Refactor to display roles table for reference and maybe employees table.
    const createEmployee = async(first_name, last_name, role_id, manager_id) => {
        if (first_name && last_name) {
            console.log(first_name + ' ' + last_name);
            if (role_id && manager_id) {
                databaseQueries.addEmployee(first_name, last_name, role_id, manager_id);
                console.log("Adding employee to database...");
                fetchEmployees();
            } else if (role_id) {
                manager_id = null;
                databaseQueries.addEmployee(first_name, last_name, role_id, manager_id);
                console.log("Adding employee to database...");
                fetchEmployees();
            } else if (manager_id) {
                role_id = null;
                databaseQueries.addEmployee(first_name, last_name, role_id, manager_id);
                console.log("Adding employee to database...");
                fetchEmployees();
            } else {
                manager_id = null;
                role_id = null;
                databaseQueries.addEmployee(first_name, last_name, role_id, manager_id);
                console.log("Adding employee to database...");
                fetchEmployees();
            }
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'You must provide at least a first name and last name. Please try again.');
        }
    }; 

    //TODO: Add logic to display employee + role's table. 
   const createEmployeePrompts = async() => {
         inquirer
             .prompt(
                 [
                     {
                         type: 'input',
                         name: 'first_name',
                         message: 'Please enter the first name of the employee: '
                     },
                     {
                        type: 'input',
                        name: 'last_name',
                        message: 'Please enter the last name of the employee: '
                     },
                     {
                        type: 'input',
                        name: 'role_id',
                        message: 'Please enter the role ID of the employee:(if available) '
                     },
                     {
                        type: 'input',
                        name: 'manager_id',
                        message: 'Please enter the manager ID of the employee:(if available) '
                     }
                 ]
             )
             .then((data) => {
                createEmployee(data.first_name, data.last_name, data.role_id, data.manager_id);
             })
             .catch((err) => {
                console.log(err);
             });
     };  


    const updateExistingEmployeeRolePrompts = async () => {
        const userData = await databaseQueries.fetchAllEmployees()
        .then((data) => {
            console.table(data);
        })
        .then(() => {
            inquirer
                .prompt (
                    [
                        {
                            type: 'input',
                            name: 'employeeID',
                            message: 'Please enter the employee ID of the employee that you wish to update:(Refer to the table above to retrieve the ID) '
                        }, 
                        {
                            type: 'input',
                            name: 'newEmployeeRoleID',
                            message: 'Please enter the new employee role ID: '
                        }
                    ]
                )
                .then((data) => {
                    console.log(data.employeeID);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err)
        });
    };


    const navMenu = () => {
        inquirer
            .prompt(
                [
                    {
                        type: 'list',
                        name: 'choice',
                        message: 'Please select one of the options below to get started',
                        choices: [
                            "View All Departments",
                            "View All Roles",
                            "View All Employees",
                            "Add a Department",
                            "Add a Role",
                            "Add an Employee",
                            "Update an Employee Role",
                            "Update Employee Managers",
                            "View Employees by Manager",
                            "View Employees by Department",
                            "Delete Departments, Roles, and Employees",
                            "View Department Budget",
                            "Exit Application"
                        ]
                    }
                ]
            ).then((userSelection) => {
                console.log(userSelection);
                switch (userSelection.choice) {
                    case "View All Departments": fetchDepartments();
                        break;
                    case "View All Roles": fetchRoles();
                        break;
                    case "View All Employees": fetchEmployees();
                        break;
                    case "Add a Department": createDepartmentPrompts();
                        break;
                    case "Add a Role": createRolePrompts();
                        break;
                    case "Add an Employee": createEmployeePrompts();
                        break;
                    case "Update an Employee Role": updateExistingEmployeeRolePrompts();
                        break;
                    case "Update Employee Managers": updateExistingEmployeeManagersPrompts();
                        break;
                    case "View Employees by Manager": fetchEmployeesByManagerPrompts();
                        break;
                    case "View Employees by Department": fetchEmployeesByDepartmentPrompts();
                        break;
                    case "Delete Departments, Roles, and Employees": removeEntityPrompts();
                        break;
                    case "View Department Budget": fetchBudgetByDepartmentPrompts();
                        break;
                    default: 
                        return userSelection;
                }
            });
    };
    navMenu();
};


userPrompts();
