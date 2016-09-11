/*******************************************************************************
 * Users
 ******************************************************************************/

DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id integer primary key autoincrement,
    email text not null,
    name text not null
);

INSERT INTO users(email, name) VALUES(
    'fabio.maia@ua.pt',
    'Fábio Maia'
);

INSERT INTO users(email, name) VALUES(
    'manuelxarez@ua.pt',
    'Manuel Xarez'
);

INSERT INTO users(email, name) VALUES(
    'peter@norvig.com',
    'Peter Norvig'
);

INSERT INTO users(email, name) VALUES(
    'rms@gnu.org',
    'Richard Stallman'
);

INSERT INTO users(email, name) VALUES(
    'torvalds@linux-foundation.org',
    'Linus Torvalds'
);

/*******************************************************************************
 * Expenses
 ******************************************************************************/

DROP TABLE IF EXISTS expenses;

CREATE TABLE expenses (
    id integer primary key autoincrement,
    group_id integer not null,
    value real not null,
    description text not null,
    creditor_id integer not null
);

INSERT INTO expenses(group_id, value, description, creditor_id) VALUES(3, 2.54, 'Breakfast', 1);
INSERT INTO expenses(group_id, value, description, creditor_id) VALUES(3, 10, 'Lunch', 2);
INSERT INTO expenses(group_id, value, description, creditor_id) VALUES(3, 12, 'Dinner', 3);
INSERT INTO expenses(group_id, value, description, creditor_id) VALUES(3, 15, 'Snacks', 3);

/*******************************************************************************
 * Expenses-Debtors Relationship
 ******************************************************************************/

DROP TABLE IF EXISTS expenses_debtors;
CREATE TABLE expenses_debtors (
    id integer primary key autoincrement,
    expense_id integer not null,
    debtor_id integer not null
);

INSERT INTO expenses_debtors(expense_id, debtor_id) VALUES(1, 1);
INSERT INTO expenses_debtors(expense_id, debtor_id) VALUES(1, 2);
INSERT INTO expenses_debtors(expense_id, debtor_id) VALUES(1, 3);


/*******************************************************************************
 * Groups
 ******************************************************************************/

DROP TABLE IF EXISTS groups;

CREATE TABLE groups (
    id integer primary key autoincrement,
    name text not null
);

INSERT INTO groups(name) VALUES('Vacations');
INSERT INTO groups(name) VALUES('Birthday');
INSERT INTO groups(name) VALUES('Hackathon');

/*******************************************************************************
* Groups-Users Relationship
******************************************************************************/

DROP TABLE IF EXISTS groups_users;

CREATE TABLE groups_users (
    id integer primary key autoincrement,
    group_id integer not null,
    user_id integer not null
);

INSERT INTO groups_users(group_id, user_id) VALUES(1, 1);
INSERT INTO groups_users(group_id, user_id) VALUES(1, 2);
INSERT INTO groups_users(group_id, user_id) VALUES(1, 3);

INSERT INTO groups_users(group_id, user_id) VALUES(2, 1);
INSERT INTO groups_users(group_id, user_id) VALUES(2, 2);
INSERT INTO groups_users(group_id, user_id) VALUES(2, 3);
INSERT INTO groups_users(group_id, user_id) VALUES(2, 4);

INSERT INTO groups_users(group_id, user_id) VALUES(3, 1);
INSERT INTO groups_users(group_id, user_id) VALUES(3, 2);
INSERT INTO groups_users(group_id, user_id) VALUES(3, 3);
INSERT INTO groups_users(group_id, user_id) VALUES(3, 4);
INSERT INTO groups_users(group_id, user_id) VALUES(3, 5);
