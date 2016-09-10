/*******************************************************************************
 * Users
 ******************************************************************************/

drop table if exists users;

create table users(
    id integer primary key autoincrement,
    email text not null,
    name text not null
);

insert into users(email, name) VALUES(
    'fabio.maia@ua.pt',
    'Fábio Maia'
);

insert into users(email, name) VALUES(
    'manuelxarez@ua.pt',
    'Manuel Xarez'
);

insert into users(email, name) VALUES(
    'peter@norvig.com',
    'Peter Norvig'
);

insert into users(email, name) VALUES(
    'rms@gnu.org',
    'Richard Stallman'
);

insert into users(email, name) VALUES(
    'torvalds@linux-foundation.org',
    'Linus Torvalds'
);

/*******************************************************************************
 * Expenses
 ******************************************************************************/

drop table if exists expenses;

create table expenses (
    id integer primary key autoincrement,
    group_id integer not null,
    value real not null,
    description text not null,
    creditor integer not null
);

insert into expenses(group_id, value, description, creditor) VALUES(3, 2.54, 'Breakfast', 1);
insert into expenses(group_id, value, description, creditor) VALUES(3, 10, 'Lunch', 2);
insert into expenses(group_id, value, description, creditor) VALUES(3, 12, 'Dinner', 3);
insert into expenses(group_id, value, description, creditor) VALUES(3, 15, 'Snacks', 3);

/*******************************************************************************
 * Expenses-Debtors Relationship
 ******************************************************************************/

drop table if exists expenses_debtors;
create table expenses_debtors (
    id integer primary key autoincrement,
    expense_id integer not null,
    debtor_id integer not null
);

insert into expenses_debtors(expense_id, debtor_id) VALUES(1, 1);
insert into expenses_debtors(expense_id, debtor_id) VALUES(1, 2);
insert into expenses_debtors(expense_id, debtor_id) VALUES(1, 3);


/*******************************************************************************
 * Groups
 ******************************************************************************/

drop table if exists groups;

create table groups (
    id integer primary key autoincrement,
    name text not null
);

insert into groups(name) VALUES('Vacations');
insert into groups(name) VALUES('Birthday');
insert into groups(name) VALUES('Hackathon');

/*******************************************************************************
* Groups-Users Relationship
******************************************************************************/

drop table if exists groups_users;

create table groups_users (
    id integer primary key autoincrement,
    group_id integer not null,
    user_id integer not null
);

insert into groups_users(group_id, user_id) VALUES(1, 1);
insert into groups_users(group_id, user_id) VALUES(1, 2);
insert into groups_users(group_id, user_id) VALUES(1, 3);

insert into groups_users(group_id, user_id) VALUES(2, 1);
insert into groups_users(group_id, user_id) VALUES(2, 2);
insert into groups_users(group_id, user_id) VALUES(2, 3);
insert into groups_users(group_id, user_id) VALUES(2, 4);

insert into groups_users(group_id, user_id) VALUES(3, 1);
insert into groups_users(group_id, user_id) VALUES(3, 2);
insert into groups_users(group_id, user_id) VALUES(3, 3);
insert into groups_users(group_id, user_id) VALUES(3, 4);
insert into groups_users(group_id, user_id) VALUES(3, 5);
