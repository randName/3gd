from datetime import datetime
from flask import request, json, send_from_directory
from time import time
from app import rd, db, models, app
from .models import Wire, Trigger
from werkzeug.utils import secure_filename
from os.path import join

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/wires')
def wires():
    return app.send_static_file('wires.html')

@app.route('/wires/<int:cam>')
def getwires(cam):
    def details(w):
        pt = tuple(tuple(int(i) for i in p.split(',')) for p in rd.lrange('p_%s'%w._id,0,-1))
        return {
            'points': pt,
            'triggered': w.last_triggered,
            'id': w._id,
            'link': 'https://maker.ifttt.com/trigger/%s_trigg/with/key/bdscqBIYJ5A1Jncfdl1zvy' % w.name
        }
    out = { "status": "ok" }
    out["wires"] = { w.name: details(w) for w in Wire.query.all() }
    return json.jsonify(out)

@app.route('/wires/new', methods=['POST'])
def newwire():
    wire = request.get_json()
    w = Wire(wire['name'])
    db.session.add(w)
    db.session.flush()

    for p in wire['points']:
        rd.rpush('p_%s'%w._id, '{0[0]},{0[1]}'.format(p))

    db.session.commit()
    out = { "status": "ok", "wire": w._id }
    return json.jsonify(out)
    #Wire(wire['name']

@app.route('/delete/<wire>')
def deletew(wire):
    Trigger.query.filter_by(wire=wire).delete()
    Wire.query.filter_by(_id=wire).delete()
    db.session.commit()
    out = { "status": "ok" }
    return json.jsonify(out)

@app.route('/trigger/<wire>')
def trigger(wire):
    db.session.add(Trigger(wire))
    db.session.commit()
    out = { "status": "ok" }
    return json.jsonify(out)

@app.route('/frame', methods=['POST'])
def send_frame():
    out = { "status": "bad" }
    if 'file' not in request.files:
        return json.jsonify(out)
    f = request.files['file']
    if f.filename == '':
        return json.jsonify(out)
    if f and f.filename.endswith('.jpg'):
        f.save(join(app.config['UPLOAD_FOLDER'], 'cam.jpg'))
        out["status"] = "ok"
        return json.jsonify(out)
    return json.jsonify(out)

@app.route('/uploads/<fn>')
def ulfile(fn):
    return send_from_directory(app.config['UPLOAD_FOLDER'], fn)

@app.route('/histogram')
def hist():
    out = { "status": "ok" }
    h = db.session.query(
        db.func.date_trunc('minute', Trigger.time).label('m'),
        db.func.count(Trigger._id)).group_by('m').all()
    
    out['triggers'] = tuple( {
        'Time': '{:%d/%m/%Y %I:%M %p}'.format(t[0]),
        'Frequency': t[1]} for t in h )
    return json.jsonify(out)
