from flask import Flask, render_template
from models import *
from config import Config
from flask_restful import Resource, Api
from api_routes import *
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
  db.create_all()  # Create the database tables
  a = Admin(password="abcd")
  db.session.add(a)
  db.session.commit()


def get_users():
  users = Student.query.all()
  user_list = []
  for user in users:
    user_dict = {
      'roll_number': user.roll_number,
      'name': user.name,
      'email': user.email
      # Add more fields as needed
    }
    user_list.append(user_dict)
  return user_list


@app.route("/")
def login_func():
  return render_template("login.html")


api = Api(app)
api.add_resource(Login, "/api/login")
api.add_resource(SignUp, "/api/signup")
api.add_resource(Dashboard, "/api/dashboard")
api.add_resource(AdminLogin, "/api/admin_login")
api.add_resource(Student_Profile, "/api/profile/<email>")
api.add_resource(Jobs_module, "/api/jobs", "/api/admin/jobs")
api.add_resource(Workshop_module, "/api/workshops", "/api/admin/workshops")
api.add_resource(Change_password_student, "/api/change_password")
api.add_resource(Change_password_admin, "/api/admin/change_password")
api.add_resource(student_connect, "/api/connect")

if __name__ == '__main__':
  app.run(debug=False, port='3000', host='0.0.0.0')
