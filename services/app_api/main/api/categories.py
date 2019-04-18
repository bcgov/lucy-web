from flask import Blueprint, jsonify
from main.api.googleauth import authorized
from main.api.models import Category

categories_blueprint = Blueprint('categories', __name__)

# GET category table contents
@categories_blueprint.route('/api/v1/categories', methods=['GET'], strict_slashes=False)
@authorized
def get_categories():
    response_object = {
        'categories': [category.to_json() for category in Category.query.all()]
    }
    return jsonify(response_object), 200