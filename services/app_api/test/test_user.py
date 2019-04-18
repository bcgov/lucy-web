import json
import unittest
from main import db
from main.api.models import User
from test.base import BaseTestCase

# Helper function to add user entries to the DB
def create_user(gid, username, email, token):
    user = User(gid=gid, username=username, email=email, access_token=token)
    db.session.add(user)
    db.session.commit()
    return user

# Tests for the User Service
class TestUserService(BaseTestCase):
    # Basic happy path, ensure the /users route behaves correctly
    def test_user_creation(self):
        with self.client:
            response = self.client.post('/api/v1/users',
                data=json.dumps({
                    'gid': '1234567890',
                    'username': 'example',
                    'email': 'example@freshworks.io',
                    'access_token': '12345678900987654321'
                }),
                content_type='application/json',
            )
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 201)
        self.assertIn('1234567890', data['gid'])
        self.assertIn('example', data['username'])
        self.assertIn('example@freshworks.io', data['email'])
        self.assertEqual('12345678900987654321', data['access_token'])

    # Ensure the /users route returns 200 for duplicate user POST
    def test_duplicate_user_creation(self):
        user = create_user('1234567890', 'example', 'example@freshworks.io', '12345678900987654321')
        with self.client:
            response = self.client.post('/api/v1/users',
                data=json.dumps({
                    'gid': user.gid,
                    'username': user.username,
                    'email': user.email,
                    'access_token': user.token
                }),
                content_type='application/json',
            )
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn(user.gid, data['gid'])
        self.assertIn(user.username, data['username'])
        self.assertIn(user.email, data['email'])
        self.assertEqual(user.token, data['access_token'])

if __name__ == '__main__':
    unittest.main()