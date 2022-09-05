-- Will add seed data here: 

INSER INTO departname (name) 
VALUES 
    ("Sales"),
    ("Custom Support"),
    ("Project Management"),
    ("HR"),
    ("Finance");


INSERT INTO role (title, salary, department_id)
VALUES
    ("Accountant", 60000, 5),
    ("Customer Support Manager", 50000, 2),
    ("HR Manager", 80000, 4),
    ("Project Manager", 65000, 3),
    ("Sales Consultant", 55000, 1),
    ("Sales Manager", 70000, 1),
    ("Finance Manager", 90000, 5),
    ("Custom Support Agent", 45000, 2),
    ("Recruiter", 40000, 4);
    ("Office Manager", 70000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id);
VALUES
    ("Angela", "Martin", 1, 1),
    ("Oscar", "Martinez", 1, 1),
    ("Kelly", "Kapoor", 2, 1),
    ("Michael", "Scott", 10, Null),
    ("Toby", "Flenderson", 3, 1),
    ("Dwight", "Schrute", 5, 7),
    ("Jim", "Halpert", 6, 1);
