import os
import json
from sqlite3 import dbapi2 as sqlite3
from flask import Flask, request, send_from_directory, jsonify, session, g, redirect, url_for, abort, render_template, flash

app = Flask(__name__, static_url_path='')

app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'kiptab.db'),
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

################################################################################
# Database
################################################################################

def db_connect():
    """Connects to the specific database."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

def db_init():
    """Initializes the database."""
    db = db_get()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

@app.cli.command()
def initdb():
    db_init()
    print('Initialized the database.')


def db_get():
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
# API Users
################################################################################

@app.route('/api/users', methods=['GET'])
def api_users_get():
    db = db_get()
    cur = db.execute('select email, name from users order by id asc')
    records = cur.fetchall()
    users = [dict(record) for record in records]
    print(users)
    res = { 'users': users }
    return jsonify(**res)

@app.route('/api/users', methods=['POST'])
def api_users_post():
    db = db_get()
    req = request.get_json(force=True)
    db.execute('insert into users (email, name) values (?, ?)', [req['email'], req['name']])
    db.commit()
    return jsonify(**req)

################################################################################
# API Groups
################################################################################

def db_get_groups():
    db = db_get()
    cur = db.execute('select name from groups order by id asc')
    records = cur.fetchall()
    groups = [dict(record) for record in records]
    return groups

@app.route('/api/groups', methods=['GET'])
def api_groups_get():
    groups = db_get_groups()
    res = { 'groups': groups }
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
