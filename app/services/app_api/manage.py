import base64
import unittest
from flask.cli import FlaskGroup
from main import create_app, db
from main.api.models import Category
from main.api.models import Species

app = create_app()
cli = FlaskGroup(create_app=create_app)

@cli.command()
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()

@cli.command()
def seed_db():
    # Open and encode images with base64
    with open("./resources/Category_Animals.txt", "r") as image_file:
        encoded_animal = image_file.read()
    with open("./resources/Category_Plants.txt", "r") as image_file:
        encoded_plant = image_file.read()
    with open("./resources/Category_Fish.txt", "r") as image_file:
        encoded_fish = image_file.read()
    with open("./resources/Category_Insects.txt", "r") as image_file:
        encoded_insect = image_file.read()
    with open("./resources/Category_Fungi.txt", "r") as image_file:
        encoded_fungus = image_file.read()

    # Create example data
    db.session.add(Category(name='Animal', icon=encoded_animal))
    db.session.add(Category(name='Plant', icon=encoded_plant))
    db.session.add(Category(name='Fish', icon=encoded_fish))
    db.session.add(Category(name='Insect', icon=encoded_insect))
    db.session.add(Category(name='Fungus', icon=encoded_fungus))
    db.session.commit()
    db.session.add(Species(name='Norway rat', latin='Rattus norvegicus', description='Brown or dark grey in colour.', introduced='1880-01-01', catid=1))
    db.session.add(Species(name='American Bullfrog', latin='Lithobates catesbeianus', description='Large robust body that can reach 20 centimeters in length.', introduced='1960-03-24', catid=1))
    db.session.add(Species(name='Giant hogweed', latin='Heracleum mantegazzianum', description='Small white flower clusters in an umbrella-shaped head.', introduced='1920-01-01', catid=2))
    db.session.add(Species(name='Knotweed, Bohemian', latin='Fallopia x bohemica', description='Small white-green flowers that grow in showy, plume-like, branched clusters along the stem and leaf joints.', introduced='1920-02-02', catid=2))
    db.session.add(Species(name='Knotweed, Giant', latin='Fallopia sachalinensis', description='Spreads rapidly through root systems that may extend from a parent plant up to 20 metres laterally and up to a depth of 3 metres.', introduced='1920-11-01', catid=2))
    db.session.add(Species(name='Yellow Flag Iris', latin='Iris pseudacorus', description='Perennial that creates dense stands in wet areas.', introduced='1800-01-01', catid=2))
    db.session.add(Species(name='Yellow Perch', latin='Perca flavescens', description='Freshwater perciform fish.', introduced='1814-01-01', catid=3))
    db.session.add(Species(name='Japanese Beetle', latin='Popillia japonica', description='Oval-shaped and approximately 1 cm long.', introduced='1916-01-01', catid=4))
    db.session.add(Species(name='European Fire Ant', latin='Myrmica rubra', description='Small red to brownish red ant that can be identified by its two waist segments.', introduced='1920-02-01', catid=4))
    db.session.add(Species(name='Death Cap Mushroom', latin='Amanita phalloides', description='Skirt-like ring on stem and cup or volva enveloping the base of the stem.', introduced='1960-02-22', catid=5))
    db.session.commit()

@cli.command()
def test():
    # Runs the tests without code coverage
    tests = unittest.TestLoader().discover('test', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

if __name__ == '__main__':
    cli()