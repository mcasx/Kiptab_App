import os
import json
from sqlite3 import dbapi2 as sqlite3
from flask import Flask, request, send_from_directory, jsonify, session, g, redirect, url_for, abort, render_template, flash

app = Flask(__name__, static_url_path='')

app.config.update(
    DATABASE=os.path.join(app.root_path, 'kiptab.db'),
    DEBUG=False,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
)

################################################################################
# Database
################################################################################

def db_connect():
    """Connects to the specific database."""
    def dict_factory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = dict_factory

    return rv

def db_init():
    """Initializes the database."""
    db = db_open()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

@app.cli.command()
def initdb():
    db_init()
    print('Initialized the database.')


def db_open():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = db_connect()
    return g.sqlite_db


@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.route('/api', methods=['GET'])
def api_index():
    entries = {'resources': ['/api/users', '/api/groups']}
    return jsonify(**entries)

################################################################################
# API: Users
################################################################################

@app.route('/api/users', methods=['GET'])
def api_users_get():
    db = db_open()
    cur = db.execute('select email, name from users order by id asc')
    records = cur.fetchall()
    res = { 'users': records }
    return jsonify(**res)

@app.route('/api/users', methods=['POST'])
def api_users_post():
    db = db_open()
    req = request.get_json(force=True)
    db.execute('INSERT INTO users (email, name) VALUES (?, ?)', [req['email'], req['name']])
    db.commit()
    res = {'message': 'POST request successful'}
    return jsonify(**res)

################################################################################
# API: Expenses
################################################################################

def db_get_expense_creditor(expense_id):
    db = db_open()
    cur = db.execute('SELECT email,name FROM users INNER JOIN expenses ON users.id = expenses.creditor_id WHERE expenses.id = ?', expense_id)
    creditor = cur.fetchall()[0]
    return creditor

def db_get_expense_debtors(expense_id):
    db = db_open()
    cur = db.execute('SELECT u.name,u.email FROM users u WHERE u.id IN (SELECT ed.debtor_id FROM expenses_debtors ed WHERE ed.expense_id = ?)', expense_id)
    debtors = cur.fetchall()
    return debtors

@app.route('/api/expenses', methods=['GET'])
def api_expenses_get():
    db = db_open()
    cur = db.execute('SELECT * FROM expenses ORDER BY id ASC')
    results = cur.fetchall()

    expenses = []
    for result in results:
        expenses.append({
            'creditor': db_get_expense_creditor(str(result['creditor_id'])),
            'debtors': db_get_expense_debtors(str(result['id'])),
            'value': result['value'],
            'description': result['description'],
        })

    res = { 'expenses': expenses }
    return jsonify(**res)



@app.route('/api/expenses', methods=['POST'])
def api_expenses_post():
    db = db_open()
    req = request.get_json(force=True)

    db.execute('INSERT INTO expenses(group_id, value, description, creditor_id) VALUES(?, ?, ?, ?)', [req['group_id'], req['value'], req['description'], req['creditor_id']])
    db.commit()

    cur = db.execute('SELECT last_insert_rowid()')
    records = cur.fetchall()
    expense_id = records[0]

    for debtor_id in req['debtor_ids']:
        db.execute('INSERT INTO expenses_debtors(expense_id, debtor_id) VALUES(?, ?)', [str(expense_id), str(debtor_id)])

    res = {'message': 'POST request successful'}
    return jsonify(**res)

################################################################################
# API: Groups
################################################################################

def db_get_group_expenses(group_id):
    db = db_open()
    cur = db.execute('SELECT * FROM expenses WHERE group_id = ?', group_id)
    results = cur.fetchall()

    expenses = []
    for result in results:
        expenses.append({
            'creditor': db_get_expense_creditor(str(result['creditor_id'])),
            'debtors': db_get_expense_debtors(str(result['id'])),
            'value': result['value'],
            'description': result['description'],
        })

    return expenses

def db_get_group_users(group_id):
    db = db_open()
    cur = db.execute('SELECT u.name,u.email FROM users u WHERE u.id IN (SELECT gu.user_id FROM groups_users gu WHERE gu.group_id = ?)', group_id)
    records = cur.fetchall()
    return records

def db_get_group_name(group_id):
    db = db_open()
    cur = db.execute('SELECT name FROM groups WHERE id = ?', group_id)
    records = cur.fetchall()
    return records[0]['name']

def db_get_groups_size():
    db = db_open()
    cur = db.execute('SELECT COUNT(*) FROM groups')
    records = cur.fetchall()
    return records[0]['COUNT(*)']

def db_get_groups():
    groups = []
    for i in range(1, db_get_groups_size()+1):
        groups.append({
            "name": db_get_group_name(str(i)),
            "users": db_get_group_users(str(i)),
            "expenses": db_get_group_expenses(str(i))
        })
    return groups

@app.route('/api/groups', methods=['GET'])
def api_groups_get():
    groups = db_get_groups()
    res = { 'groups': groups }
    return jsonify(**res)

@app.route('/api/groups', methods=['POST'])
def api_groups_post():
    db = db_open()
    req = request.get_json(force=True)
    db.execute('INSERT INTO groups (name) VALUES (?)', [req['name']])
    db.commit()
    res = {'message': 'POST request successful'}
    return jsonify(**res)

################################################################################
# Client
################################################################################

@app.route('/')
def client_index():
    return open('../client/index.html').read()

@app.route('/scripts/<path:path>')
def client_scripts(path):
    return send_from_directory('../client/scripts', path)

@app.route('/styles/<path:path>')
def client_styles(path):
    return send_from_directory('../client/styles', path)

@app.route('/images/<path:path>')
def client_images(path):
    return send_from_directory('../client/images', path)

@app.route('/fonts/<path:path>')
def client_fonts(path):
    return send_from_directory('../client/fonts', path)


if __name__ == "__main__":
    app.run()
