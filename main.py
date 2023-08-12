from flask import Flask, render_template
from models import db, Student, admin, Assesment, jobs, Workshop, experience
from config import Config
from flask_restful import Resource, Api, reqparse
from api_routes import LoginAPI


app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
  db.create_all()  # Create the database tables


@app.route("/")
def login_func():
  return render_template("login.html")


api = Api(app)
api.add_resource(LoginAPI, "/api/","/jobs")


if __name__ == '__main__':
  app.run(debug=False, port='3000', host='0.0.0.0')
