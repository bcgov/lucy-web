from flask import Blueprint, jsonify, request
from sqlalchemy import exc
from main import db
from main.api.models import User

users_blueprint = Blueprint('users', __name__)

# POST user, registering their information
@users_blueprint.route('/api/v1/users', methods=['POST'], strict_slashes=False)
def create_user():
    # Default error response
    response_object = {
        'errors': ['Invalid request.']
    }
    post_data = request.get_json()
    if not post_data:
        return jsonify(response_object), 400

    # Get request data
    google_id = post_data.get('gid')
    username = post_data.get('username')
    email = post_data.get('email')
    access_token = post_data.get('access_token')

    # Check whether this is a duplicate user, if so just return 200
    try:
        db_user = None
        db_user = User.query.filter_by(gid=google_id).first()
        if db_user:
            return jsonify(db_user.to_json()), 200
    except (exc.DataError, exc.IntegrityError) as e:
        return jsonify(response_object), 400

    # Add to DB
    user = User(gid=google_id, username=username, email=email, access_token=access_token)
    db.session.add(user)
    db.session.commit()

    # Return created user
    return jsonify(user.to_json()), 201