const inquirer = require('inquirer');


const userPrompts = () => {

    const exitApplication = async() = {
        // TODO: Add logic to close application when user enters exit as their choice. 
    };

    const fetchDepartments = async() => {
        fetchAllDepartments();
    };

    const fetchRoles = async () => {
        fetchAllRoles();
    };

    const fetchEmployees = async() => {
        fetchAllEmployees();
    };

    const createDepartment = async () => {
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
            .then((departmentName) => {
                addDepartment(departmentName);
            })
            .catch((err) => {
                console.log(err);
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
                    case "Add a Department": createDepartment();
                        break;
                    case "Add a Role": createRole();
                        break;
                    case "Add an Employee": createEmployee();
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
                        exitApplication();
                }
            });
    };
};

module.exports = userPrompts;
