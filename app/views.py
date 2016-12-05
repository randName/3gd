from app import rd, db, models, app

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/lines')
def lines():
    return app.send_static_file('lines.html')
