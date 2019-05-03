from main import db

class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.Text, nullable=False)
    db.UniqueConstraint(name)

    def __init__(self, name, icon):
        self.name = name
        self.icon = icon

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'icon': self.icon
        }

class Species(db.Model):
    __tablename__ = 'species'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    latin = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    introduced = db.Column(db.Date, nullable=False)
    catid = db.Column(db.Integer, db.ForeignKey('category.id'))

    def __init__(self, name, latin, description, introduced, catid):
        self.name = name
        self.latin = latin
        self.description = description
        self.introduced = introduced
        self.catid = catid

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'latin': self.latin,
            'introduction': self.introduced.strftime('%Y-%m-%d'),
            'description': self.description,
            'category': Category.query.filter_by(id=self.catid).first().name
        }

    def to_list_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'latin': self.latin,
            'introduction': self.introduced.strftime('%Y-%m-%d'),
            'category': Category.query.filter_by(id=self.catid).first().name
        }

class User(db.Model):
    __tablename__ = 'user'
    gid = db.Column(db.String(100), primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    token = db.Column(db.Text, nullable=False)

    def __init__(self, gid, username, email, access_token):
        self.gid = gid
        self.username = username
        self.email = email
        self.token = access_token

    def to_json(self):
        return {
            'gid': self.gid,
            'username': self.username,
            'email': self.email,
            'access_token': self.token
        }