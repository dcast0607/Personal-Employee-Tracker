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
        const departmentData = await databaseQueries.addDepartment(departmentName)
        .then(() => {
            console.log("Adding department to database...");
            fetchDepartments();
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const createDepartmentPrompts = async() => {
        inquirer
        .prompt(
            [
                {
                    type: 'input',
                    name: 'department',
                    message: 'Please enter the name of the department: '
                }
            ]
        )
        .then((data) => {
            createDepartment(data.department);
        })
        .catch((err) => {
            console.log(err);
        })
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
