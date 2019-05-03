from flask import Blueprint, jsonify, request
from sqlalchemy import exc
from main import db
from main.api.googleauth import authorized
from main.api.models import Category, Species

species_blueprint = Blueprint('species', __name__)

# Get or create species table contents
@species_blueprint.route('/api/v1/species', methods=['GET', 'POST'], strict_slashes=False)
@authorized
def get_post_species():
    # Default error response
    response_object = {
        'errors': ['Invalid request.']
    }

    if request.method == 'GET':
        # Handle invalid args
        if len(request.args.getlist('category')) > 1:
            response_object['errors'].append('Too many arguments. Only one category is allowed.')
            return jsonify(response_object), 400

        # Return all results if not filtering by category information
        category_name = request.args.get('category')
        if category_name is None:
            response_object = {
                'species': [species.to_list_json() for species in Species.query.all()]
            }
            return jsonify(response_object), 200

        # Filter results
        try:
            db_species = None
            if category_name:
                db_species = Category.query.filter_by(name=category_name).first()
            if not db_species:
                response_object['errors'].append('Invalid category.')
                return jsonify(response_object), 400

            response_object = {
                'species': [species.to_list_json() for species in Species.query.filter_by(catid=db_species.id)]
            }
            return jsonify(response_object), 200
        except (exc.DataError, exc.IntegrityError) as e:
            return jsonify(response_object), 400

    elif request.method == 'POST':
        # Handle invalid input
        post_data = request.get_json()
        if not post_data:
            return jsonify(response_object), 400

        # Get request data
        name = post_data.get('name')
        latin = post_data.get('latin')
        introduced = post_data.get('introduction')
        description = post_data.get('description')
        category_name = post_data.get('category')

        # Look up category
        db_category = None
        if category_name:
            db_category = Category.query.filter_by(name=category_name).first()
        if not db_category:
            response_object['errors'].append('Invalid category.')
            return jsonify(response_object), 400

        # Add to DB
        species = Species(name=name, latin=latin, description=description, introduced=introduced, catid=db_category.id)
        db.session.add(species)
        db.session.commit()

        # Return created species
        return jsonify(species.to_json()), 201

# Get, update, or delete a single species
@species_blueprint.route('/api/v1/species/<int:id>', methods=['GET', 'PUT', 'DELETE'], strict_slashes=False)
@authorized
def get_put_delete_species(id):
    # Default error response
    response_object = {
        'errors': ['Invalid request.']
    }

    # Handle invalid args: look up species by ID
    db_species = None
    db_species = Species.query.filter_by(id=id).first()
    if not db_species:
        response_object['errors'].append('Invalid species ID.')
        return jsonify(response_object), 400
    
    if request.method == 'GET':
        # Return species details
        return jsonify(db_species.to_json()), 200

    elif request.method == 'PUT':
        # Handle invalid input
        put_data = request.get_json()
        if not put_data:
            return jsonify(response_object), 400

        # Get request data
        # Note: we do not throw an error if the ID has been changed in the request body
        name = put_data.get('name')
        latin = put_data.get('latin')
        introduced = put_data.get('introduction')
        description = put_data.get('description')
        category_name = put_data.get('category')

        # Look up category
        db_category = None
        if category_name:
            db_category = Category.query.filter_by(name=category_name).first()
        if not db_category:
            response_object['errors'].append('Invalid category.')
            return jsonify(response_object), 400

        # Update DB
        db_species.name = name
        db_species.latin = latin
        db_species.description = description
        db_species.introduced = introduced
        db_species.catid = db_category.id
        db.session.commit()

        # Return updated object
        return jsonify(db_species.to_json()), 200

    elif request.method == 'DELETE':
        # Detete species
        db.session.delete(db_species)
        db.session.commit()

        # Return success
        response_object = {
            'status': 'Successfully deleted species.'
        }
        return jsonify(response_object), 200