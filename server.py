import json
from flask import Flask, request, send_from_directory, jsonify

app = Flask(__name__, static_url_path='')

@app.route('/api')
def api():
    data = json.load(open('mock.json'))
    return jsonify(**data)

@app.route('/')
def index():
    return open('index.html').read()

@app.route('/scripts/<path:path>')
def scripts(path):
    return send_from_directory('scripts', path)

@app.route('/styles/<path:path>')
def styles(path):
    return send_from_directory('styles', path)

if __name__ == "__main__":
    app.run()
