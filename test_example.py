import pytest
from flask import Flask
from models import *
from config import Config
from flask_restful import Resource, Api
from api_routes import *
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
app.config.from_object(Config)
app.jinja_options['variable_start_string'] = '[['
app.jinja_options['variable_end_string'] = ']]'

db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
  db.create_all()  # Create the database tables
  data = Admin.query.all()
  if len(data) == 0:
    a = Admin(password="abcd")
    db.session.add(a)
    db.session.commit()
api = Api(app)
api.add_resource(Login, "/api/login")
api.add_resource(SignUp, "/api/signup")
api.add_resource(Dashboard, "/api/dashboard")

@pytest.fixture
def client():

  with app.test_client() as client:
    yield client

def test_successful_signup(client):
  data = {
    "Name": "test9",
    "roll_no": "21f1000009",
    "Email": "test9@mail.com",
    "Password": "qwerty"
  }

  response = client.post("/api/signup", json=data)
  assert response.status_code == 201
  assert response.json["message"] == "test9"

def test_unsuccessful_signup(client):
  data = {
    "Name": "test1",
    "roll_no": "21f1000001",
    "Email": "test1@mail.com",
    "Password": "qwe"
  }

  response = client.post("/api/signup", json=data)
  assert response.status_code == 401
  assert response.json["message"] == "Sign up Failed"

def test_successful_login(client):
  data = {"Email": "test1@mail.com", "Password": "qwerty"}
  response = client.post("/api/login", json=data)
  assert response.status_code == 200
  assert "access_token" in response.json

def test_failed_login(client):
  data = {"Email": "test@mail.com", "Password": "wrongpassword"}

  response = client.post("/api/login", json=data)
  assert response.status_code == 401
  assert "access_token" not in response.json
  assert response.json["message"] == "Login Failed"


def test_successful_dashboard_access(client):
    # Define a function to create an access token within app context
    def create_token_and_send_request():
        access_token = create_access_token(identity="test@mail.com")
        headers = {"Authorization": f"Bearer {access_token}"}
        return client.get("/api/dashboard", headers=headers)

    # Call the function within the app context of a test request
    with client.application.app_context():
        response = create_token_and_send_request()

    assert response.status_code == 200
    assert response.json["message"] == "Success"
    assert "Notification" in response.json
    assert len(response.json["Notification"]) == 0  

def test_unauthorized_dashboard_access(client):
    response = client.get("/api/dashboard")
    assert response.status_code == 500
  

