const { QuickSight } = require('aws-sdk');
const inquirer = require('inquirer');
const databaseQueries = require('./databaseQueries');


const userPrompts = () => {

    const quit= () => {
        console.log("Thank you for use the application!");
    };

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
        navMenu();
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
            createDepartmentPrompts();
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
            createRolePrompts();
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
            createEmployeePrompts();
        }
    }; 

   const createEmployeePrompts = async() => {

    const createEmployeePromptData = await databaseQueries.fetchEmployeeAndRolesTables()
    .then((data) => {
        console.table(data);
    })
    .then(() => {
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
                   message: 'Please enter the role ID of the employee:(If available, refer to the table above) '
                },
                {
                   type: 'input',
                   name: 'manager_id',
                   message: 'Please enter the manager ID of the employee:(If available, refer to the table above) '
                }
            ]
        )
        .then((data) => {
           createEmployee(data.first_name, data.last_name, data.role_id, data.manager_id);
        })
        .catch((err) => {
           console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
    });
    };  

    const updateExistingEmployeeRole = async(employee_id, role_id) => {
        if (employee_id && role_id) {
            const updateRole = await databaseQueries.updateExistingEmployeeRole(employee_id, role_id)
            .then((data) => {
                console.log("Updating database with new role ID...");
                //console.table(data);
            })
            .then(() => {
                fetchEmployees();
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Whoops, please make sure that you provide an employee ID and a new role ID.');
        };
    };

    const updateExistingEmployeeRolePrompts = async () => {
        const userData = await databaseQueries.fetchEmployeeAndRolesTables()
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
                    updateExistingEmployeeRole(data.employeeID, data.newEmployeeRoleID);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err)
        });
    };

    const updateManagerEmployeeRecord = async(employee_id, manager_id) => {
        if (employee_id && manager_id) {
            const updateManagerData = await databaseQueries.updateExistingEmployeeManager(employee_id, manager_id)
            .then(() => {
                console.log("Updating database data for employee...");
            })
            .then(() => {
                fetchEmployees();
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Whoops, please make sure that you provide an employee ID and a new manager ID.');
        };
    };

    const updateExistingEmployeeManagersPrompts = async() => {
        const employeeData = await databaseQueries.fetchEmployeeAndRolesTables()
        .then((data) => {
            console.table(data);
        }).then(() => {
            inquirer
                .prompt (
                    [
                        {
                            type: 'input',
                            name: 'employeeID',
                            message: 'Please enter the employee ID of the employee you wish to update:(Refer to the table above for details) '
                        },
                        {
                            type: 'input',
                            name: 'managerID',
                            message: 'Please enter the new manager ID:(Refer to the table above for details) '
                        }
                    ]
                )
                .then((data) => {
                    updateManagerEmployeeRecord(data.employeeID, data.managerID);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const fetchEmployeesByManager = async(manager_id) => {
        if (manager_id) {
            const employeeData = await databaseQueries.fetchAllEmployeesByManager(manager_id)
            .then((data) => {
                console.table(data);
                navMenu();
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Whoops, please make sure that you provide a manager ID.');
            fetchEmployeesByManagerPrompts();
        }
    };

    const fetchEmployeesByManagerPrompts = async() => {
        const employeeData = await databaseQueries.fetchAllEmployees()
        .then((data) => {
            console.table(data);
        })
        .then(() => {
            inquirer
                .prompt (
                    [
                        {
                            type: 'input',
                            name: 'managerID',
                            message: 'Please enter the ID of the manager for which you need us to pull data for:(Refer to the table above) '
                        }
                    ]
                )
                .then((data) => {
                    fetchEmployeesByManager(data.managerID);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
    }; 

    const fetchEmployeesByDepartment = async(department_id) => {
        if (department_id) {
            const employeeData = await databaseQueries.fetchAllEmployeesByDepartment(department_id)
            .then((data) => {
                console.table(data);
                navMenu();
            })
            .catch((err) => {
                console.log(err);
            })
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Whoops, please make sure that you provide a department ID.');
            fetchEmployeesByDepartmentPrompts();
        };
    };

    const fetchEmployeesByDepartmentPrompts = async() => {
        const employeeData = await databaseQueries.fetchAllDepartments()
        .then((data) => {
            console.table(data);
        })
        .then(() => {
            inquirer
                .prompt (
                    [
                        {
                            type: 'input',
                            name: 'departmentID',
                            message: 'Please enter the department ID to fetch employee data:(Refer to table above for reference) '
                        }
                    ]
                )
                .then((data) => {
                    fetchEmployeesByDepartment(data.departmentID);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const removeEntity = async(entity, entity_id) => {
        if (entity && entity_id) {
            const removeData = await databaseQueries.deleteDatabaseEntry(entity, entity_id)
            .then(() => {
                if (entity == "employee") {
                    console.log("Removing entry from the database...");

                    fetchEmployees();
                } else if (entity == "department") {
                    console.log("Removing entry from the database...");

                    fetchDepartments();
                } else if (entity == "role"){
                    console.log("Removing entry from the database...");
                    fetchRoles();
                }  else {
                    console.log('\x1b[31m%s\x1b[0m', 'Whoops, something went wrong. Please try again!');
                    navMenu();
                }           
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Whoops, please make sure that you have selected an entity type and the ID for that entity!');
            removeEntityPrompts();
        }
    };

    const removeUser = async() => {
        const removeData = await databaseQueries.fetchAllEmployees()
        .then((data) => {
            console.table(data);
        })
        .then(() => {
            inquirer
                .prompt (
                    [
                        {
                            input: 'type',
                            name: 'employeeID',
                            message: "Please enter the employee ID of the employee that you wish to remove:(Refer to the table above for reference) "
                        }
                    ]
                )
                .then((data) => {
                    removeEntity("employee", data.employeeID);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const removeDepartment = async() => {
        const removeData = await databaseQueries.fetchAllDepartments()
        .then((data) => {
            console.table(data);
        })
        .then(() => {
            inquirer
                .prompt (
                    [
                        {
                            input: 'type',
                            name: 'departmentID',
                            message: "Please enter the department ID of the department that you wish to remove:(Refer to the table above for reference) "
                        }
                    ]
                )
                .then((data) => {
                    removeEntity("department", data.departmentID);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const removeRole = async() => {
        const removeData = await databaseQueries.fetchAllRoles()
        .then((data) => {
            console.table(data);
        })
        .then(() => {
            inquirer
                .prompt (
                    [
                        {
                            input: 'type',
                            name: 'roleID',
                            message: "Please enter the employee ID of the employee that you wish to remove:(Refer to the table above for reference) "
                        }
                    ]
                )
                .then((data) => {
                    removeEntity("role", data.roleID);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const removeEntityPrompts = async() => {
        inquirer
            .prompt(
                [
                    {
                        type: 'list',
                        name: 'entitySelection',
                        message: 'Please select the entity type that you would like to remove from the database:',
                        choices: [
                            "Remove a user",
                            "Remove a department",
                            "Remove a role",
                            "Go Back"
                        ]
                    }
                ]
            )
            .then((data) => {
                console.log(data.entitySelection)
                switch(data.entitySelection) {
                    case "Remove a user": removeUser();
                        break;
                    case "Remove a department": removeDepartment();
                        break;
                    case "Remove a role": removeRole();
                        break;
                    default: navMenu();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const fetchBudgetByDepartment = async(department_id) => {
        let usersByDepartment = {};
        let departmentName;
        let totalBudget = 0;
        const budgetData = await databaseQueries.fetchDepartmentBudget(department_id)
        .then((data) => {
            console.table(data);
            usersByDepartment = data;
            //console.log(usersByDepartment);
        })
        .then(() => {
                usersByDepartment.forEach((user) => {
                    //console.log(user.salary);
                    totalBudget += parseFloat(user.salary);
                    departmentName = user.department;
            });
        })
        .then(() => {
            console.log(`Total Budget for Department "${departmentName}/${department_id}" is: ${totalBudget}.`);
            navMenu();
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const fetchBudgetByDepartmentPrompts = async() => {
        const budgetData = await databaseQueries.fetchAllDepartments()
        .then((data) => {
            console.table(data);
        })
        .then(() => {
            inquirer
                .prompt(
                    [
                        {
                            type: 'input',
                            name: 'departmentID',
                            message: "Please enter a department ID to see it's budget:(Refer to the table above for reference) "
                        }
                    ]
                )
                .then((data) => {
                    fetchBudgetByDepartment(data.departmentID);
                })
        })
        .catch((err) => {
            console.log(err)
        })
    };

    const navMenu = async () => {
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
                        return quit();
                }
            });
    };
    navMenu();
};


userPrompts();
