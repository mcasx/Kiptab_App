import json
from flask import Flask, request, send_from_directory, jsonify

app = Flask(__name__, static_url_path='')

@app.route('/api')
def api():
    if request.method == 'GET':
        with open('data.json') as f:
            data = json.load(f)
            return jsonify(**data)

    if request.method == 'POST':
        with open('data.json', 'w') as f:
            json.dump(data, f, ensure_ascii=False)

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
