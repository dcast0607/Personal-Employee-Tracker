/* 
We drop the database as part of our seeded data. 
*/
DROP DATABASE IF EXISTS employeesDB;

/*
Once the datbase has been droped we re-create it for a fresh database. 
*/
CREATE DATABASE employeesDB;

/*
We ask to use the "employeesDB" in our requests.
*/
USE employeesDB;


/*
We create a new table with the following definitions. 
    - column 1 => id with requiring a value and auto-incrementing
    - column 2 => name with a maxsize of 30 characters and requiring a value. 
*/
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

/*
We create a new employee table with the following definitions: 
    - id
    - first_name
    - last_name
    - role_id
    - manager_id
*/
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT
);


/*
We create a role table with the following information: 
    - id
    - title
    - salary
    - department_id
*/
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(9,1) NOT NULL,
    department_id INT NOT NULL
);