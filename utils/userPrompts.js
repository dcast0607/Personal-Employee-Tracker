// We start this file off by bringing in the files and packages that we will be using. 
// "databaseQueries" is the object that has the functions that we need to utilize
// throughout this js file. 
const inquirer = require('inquirer');
const databaseQueries = require('./databaseQueries');

// This function will be used to deliver the prompts and make the database queries
// requests. 
const userPrompts = () => {

    // The first function we introduce here is the quit function. This will
    // allow the user to exit the application if the don't want to continue
    // interacting with our app. We also send the user to the main menu after
    // this function finishes, in case they want to keep messing around with
    // the application.
    const quit= () => {
        console.log("Thank you for use the application!");
        console.log("Type in CTRL + C and then click enter");
    };

    // This function is used to make a database request that fetches all of the
    // departments that exist on the department table. Once we get back the data
    // that we have requested we take that data and use "console.table" to present
    // this data in a neatly organized table.
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


    // This function is used to make a database request that fetches all of the
    // role data that exists in the role table. Once we have the information
    // we have requested, we present this data to the user using "console.table". 
    // We also send the user back to the navMenu in case they want to keep
    // interacting with this app. 
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

    // This function works in the same way as the previous two functions, the only
    // difference is that this time we are retrieving employee information and
    // displaying that to the end user. 
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


    // createDepartment is called by the createDepartmentPrompts function and a departmentName
    // parameter is passed so that we can use this name to create a new department entry in our
    // department table. Once this entry have been created we make a call to the fetchDepartments
    // function so that we can display a new table that includes the newly entered information
    // this also takes care of sending the user back to the main menu. 
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

            // One cool little feature that I added is verification that the user has entered some
            // department name. If they haven't they will see an error message in red and be taken
            // back to the createDepartmentPrompts function to try to enter the data again.
            console.log('\x1b[31m%s\x1b[0m', "Whoops, please make sure that you add a department name!");
            createDepartmentPrompts();
        }
    };

    // This function works alongside the "createDepartment" function, we are using two functions here
    // because we first want to collect the name of the department that the user wants to add and then
    // once we have collected that information we send that to our "createDepartment" function to actually
    // create the new department entry in our table. 
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

    // We collect the role data that the user has entered and validate that they added some data for all
    // of these fields, in our schema, all of these fields  must be present which is why I am adding this
    // validation step. If we have collected all the necessary data we create a new entry in the role table
    // and then log a table so that the user can see that the data was added correctly. 
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

    // The createRolePrompts function works alongside the createRole function, this function is used
    // to collect data and then pass that data to the createRole function to add the new role to our
    // database.
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

    // The logic here is similar to the previous functions, the only difference here is that
    // when it comes to employee data, it is possible to have "null" data entries. We are using
    // some if statements to check the data so that if there is no data, we can pass null as a value.
    // Once the user has been created, we generate a new table that should contain the new employee
    // data. 
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


    // Similar to the two previous functions, we have a data collection step and a data entry step. 
    // This function collects the user data and sends it over to our createEmployee function for
    // validation and data entry.
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

    // Data is validated and then used to update the existing user record. Employee ID is used
    // in our "WHERE" clause in our SQL statement and "role ID" is the data that is being updated. 
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

    // We use this function to display a data table to the user so that they have some reference for 
    // the data that we are requesting, in this case an employee ID, and then once we collect that data
    // we ask for a role ID that they want to use to update the employee record. 
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

    // This function consumes the manager ID and employee ID to update the existing user record.
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

    // Collects the employee ID and manager ID and passes it to the updateManagerEmployeeRecord function.
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

    // Takes the manager ID and fetches the employees that exist with this 
    // manager ID. 
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

    // Retrieves the manager ID and passes it to the fetchEmployeesByManager function.
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

    // Takes the department ID, validates that it is not null/undefined and 
    // retrieves the requested data.
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

    // Collects the department ID and passes it to our fetchEmployeesByDepartment function.
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

    // This function validates the data that needs to be removed by filtering which 
    // table we need to remove that data from and then make a database request to 
    // remove the data. Once the data has been removed, we make a function request
    // for the respective entity and display the data to the user so that they know
    // that it has been removed.
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

    // The removeUser, removeDepartment, and removeRole functions all work very similarly
    // the purpose of these functions is to collect an "entity" and an "entity_id" that the
    // user wants to remove. Entity tells us which data table we need to look at and entity ID
    // tells us the ID of the entity that needs to be removed. Once we have collected this information
    // it gets pushed to the removeEntity function to actually remove that entity from the database.

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

    // We use this function to gather data about which type of entity the user
    // wants to delete, for example, do they want to delete a department, a role, 
    // or an employee. Once we know what the user wants to delete, we pass that information
    // to a different function to actually delete the entity. 
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

    // Department ID is passed to this function and we use this to request
    // a data table that has the data that we will be cycling through. 
    const fetchBudgetByDepartment = async(department_id) => {
        // We initialize some variables that we will be using to hold data 
        // that will be used at a later point. Most importantly here is the
        // totalBudget variable that will hold the budget for the department.
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
                // We iterate through the data we got back using a for each loop, 
                // the reason for this is so that we can look at the salary of each entry
                // we got back and add it to our totalBudget variable. Once we have iterated
                // through all of the data, we should have a total budget for the department.
                usersByDepartment.forEach((user) => {
                    //console.log(user.salary);
                    totalBudget += parseFloat(user.salary);
                    departmentName = user.department;
            });
        })
        .then(() => {
            // We console log the budget to the user here. 
            console.log(`Total Budget for Department "${departmentName}/${department_id}" is: ${totalBudget}.`);
            navMenu();
        })
        .catch((err) => {
            console.log(err);
        });
    };

    // We use this function to collect the department ID for which the user wants to
    // view the budget of. Once we have this department ID, we pass it to our fetchBudgetByDepartment
    // function to retrieve a data table that has the data we need. 
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

    // The "navMenu" function serves as our main navigation function. 
    // When the app is started, we will launch this function will will
    // present the user with a bunch of options that allows them to interact
    // with out database. Depending on what the user selects we will take them
    // into a sub menu or fetch some data from our database. We use inquirer
    // prompt and switch cases to handle this part of our logic. 
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
                // Switch cases  kick in here, depending on what the user has selected
                // we will call a function that will either deliver data to the user
                // or prompt them for some more questions before we deliver the data. 

                // We take the users selection and we then use this selection to see 
                // what the user wants to do. 
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
    // navMenu function is called here to display the prompts to the end user. 
    navMenu();
};

// We initialize the app by calling our start function. 
userPrompts();
