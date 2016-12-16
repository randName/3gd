from app import db

class Wire(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    created = db.Column(db.DateTime, server_default=db.func.now())

    def __init__(s, name):
        s.name = name

    @property
    def last_triggered(s):
        t = Trigger.query.filter(Trigger.wire==s._id)
        t = t.order_by(Trigger.time.desc()).first()
        if t is None: return 0
        return int(t.time.timestamp())

    def __str__(s):
        return '%s' % s.name

    def __repr__(s):
        return "<Wire %s>" % s._id

class Trigger(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    wire = db.Column(db.Integer, db.ForeignKey(Wire._id))
    time = db.Column(db.DateTime, server_default=db.func.now())

    def __init__(s, wire):
        s.wire = wire

    def __str__(s):
        return 'Wire %s triggered at %s' % (s.wire, s.time)

    def __repr__(s):
        return "<Trigger %s>" % s._id
