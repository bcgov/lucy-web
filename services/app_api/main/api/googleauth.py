from flask import current_app as app
from flask import jsonify, request
from httplib2 import Http

# Validate Google token
def validate_token(access_token):
    resp, cont = Http().request("https://www.googleapis.com/oauth2/v2/userinfo",
                           headers={'Host': 'www.googleapis.com',
                                    'Authorization': access_token})
    if not resp['status'] == '200':
        return jsonify({'errors': ['Unauthorized.']}), 401

    # Check validity by ensuring an email came back
    try:
        data = json.loads(cont)
    except TypeError:
        data = json.loads(cont.decode())
    return data['email']

# Decorator
def authorized(fn):
    def _wrap(*args, **kwargs):
        # If testing, return
        if app.config['TESTING']:
            return fn(*args, **kwargs)

        if 'Authorization' not in request.headers:
            return jsonify({'errors': ['No token in header.']}), 401

        user = validate_token(request.headers['Authorization'])
        if user is None:
            return jsonify({'errors': ['Unauthorized.']}), 401

        return fn(*args, **kwargs)
    _wrap.__name__ = fn.__name__
    return _wrap