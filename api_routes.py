from flask import jsonify
from flask_restful import Resource, reqparse
from models import *
from flask_jwt_extended import create_access_token, get_current_user
from flask_jwt_extended import jwt_required

login_or_signup_parser = reqparse.RequestParser()
login_or_signup_parser.add_argument('Name')
login_or_signup_parser.add_argument('Email')
login_or_signup_parser.add_argument('roll_no')
login_or_signup_parser.add_argument('Password')

# decorator for verifying the JWT
# def jwt_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = None
#         # jwt is passed in the request header
#         if 'x-access-token' in request.headers:
#             token = request.headers['x-access-token']
#         # return 401 if token is not passed
#         if not token:
#             return jsonify({'message' : 'Token is missing !!'}), 401

#         try:
#             # decoding the payload to fetch the stored details
#             data = jwt.decode(token, app.config['SECRET_KEY'])
#             current_user = Student.query.filter_by(email = data['email']).first()
#         except:
#             return jsonify({
#                 'message' : 'Token is invalid !!'
#             }), 401
#         # returns the current logged in users context to the routes
#         return  f(current_user, *args, **kwargs)


#     return decorated
class Login(Resource):

  def post(self):
    authenticated = False
    args = login_or_signup_parser.parse_args()
    data = Student.query.filter_by(email=args["Email"]).first()

    print(data.roll_number)
    if data.email == args["Email"] and data.password == args["Password"]:
      authenticated = True

    if authenticated:
      access_token = create_access_token(
        identity=args['Email'])  # Store user's email in the token
      return {"access_token": access_token}, 200
    else:
      return {"message": "Login Failed"}, 401


class SignUp(Resource):

  def post(self):
    args = login_or_signup_parser.parse_args()
    data = Student.query.all()
    print(data)
    existing = []
    for i in data:
      existing.append(i.roll_number)
    if args["roll_no"] == "" or args["Name"] == "" or args[
        "Email"] == "" or args["Password"] == "":
      return {"message": "Sign up Failed"}, 401
    if args["roll_no"] in existing:
      return {"message": "Sign up Failed"}, 401
    else:
      a = Student(roll_number=args["roll_no"],
                  name=args["Name"],
                  email=args["Email"],
                  password=args["Password"])
      db.session.add(a)
      db.session.commit()

      return {"message": args['Name']}, 201


class Dashboard(Resource):

  @jwt_required()
  def get(self):
    data = Notification.query.all()
    print("debug")
    notification_list = []
    for i in data:
      notification_list.append(i.notification_message)

    return {"message": "Success", "Notification": notification_list}, 200


class AdminLogin(Resource):

  def post(self):
    authenticated = False
    args = login_or_signup_parser.parse_args()
    data = Admin.query.all()
    password = data[0].password
    print(password)
    if password == args["Password"]:
      access_token = create_access_token(identity=args['Password'])
      return {"access_token": access_token}, 200
    return {"Message": "Login failed"}, 401
