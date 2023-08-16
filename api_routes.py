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
login_or_signup_parser.add_argument('New_Password')

student_profile_parser = reqparse.RequestParser()
student_profile_parser.add_argument('name')
student_profile_parser.add_argument('Linkedin_url')
student_profile_parser.add_argument('bio')
student_profile_parser.add_argument('age')
student_profile_parser.add_argument('skills')
student_profile_parser.add_argument('current_status')
student_profile_parser.add_argument('qualification')
student_profile_parser.add_argument('image_binary_code')

job_detail_parser = reqparse.RequestParser()
job_detail_parser.add_argument('Job_id')
job_detail_parser.add_argument('job_title')
job_detail_parser.add_argument('job_decription')
job_detail_parser.add_argument('job_location')
job_detail_parser.add_argument('apply_link')
job_detail_parser.add_argument('skills_required')
job_detail_parser.add_argument('min_qulification')

workshop_detail_parser = reqparse.RequestParser()
workshop_detail_parser.add_argument('workshop_id')
workshop_detail_parser.add_argument('workshop_title')
workshop_detail_parser.add_argument('workshop_description')
workshop_detail_parser.add_argument('workshop_registration_link')
workshop_detail_parser.add_argument("workshop_date")

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
  @jwt_required()
  def post(self):
    args = login_or_signup_parser.parse_args()
    data = Admin.query.all()
    password = data[0].password
    print(password)
    if password == args["Password"]:
      access_token = create_access_token(identity=args['Password'])
      return {"access_token": access_token}, 200
    return {"Message": "Login failed"}, 401


class Student_Profile(Resource):
  @jwt_required()
  def get(self, email):
    data = Student.query.filter_by(email=email).first()
    if data == None:
      return {"message": "Data Not found"}, 404
    data_list = [
      data.name, data.Linkedin_url, data.Age, data.bio, data.image_binary_code,
      data.current_status, data.qualification, data.skills
    ]
    return {"message": "Success", "data": data_list}, 200
  @jwt_required()
  def put(self, email):
    args = student_profile_parser.parse_args()
    data = Student.query.filter_by(email=email).first()
    if data == None:
      return {"message": "User Not found"}, 404

    data.name, data.Linkedin_url, data.Age, data.bio, data.image_binary_code, data.current_status, data.qualification, data.skills = args[
      "name"], args["Linkedin_url"], args["age"], args["bio"], args[
        "image_binary_code"], args["current_status"], args[
          "qualification"], args["skills"]

    db.session.commit()

    data_list = [
      data.name, data.Linkedin_url, data.Age, data.bio, data.image_binary_code,
      data.current_status, data.qualification, data.skills
    ]

    return {"message": "Success", "data": data_list}, 200


class Jobs_module(Resource):
  @jwt_required()
  def get(self):
    data = jobs.query.all()
    if len(data) == 0:
      return {"message": "Jobs not found"}, 404
    data_list = []
    for i in data:
      job_detail = [
        i.Job_id, i.Job_Title, i.Job_Description, i.Job_location,
        i.min_Job_salary, i.Skills_require, i.min_qualification
      ]
      data_list.append(job_detail)
    return {"message": "Success", "jobs": data_list}, 200
  @jwt_required()

  
  def post(self):
    args = job_detail_parser.parse_args()
    ## HANDLE REDUNDANCY

    if args["job_title"] == "" or args["job_decription"] == "":
      return {"message": "Enter valid details"}, 405
    a = jobs(Job_Title=args["job_title"],
             Job_Description=args["job_decription"],
             min_Job_salary=args["min_salary"],
             Skills_require=args["skills_required"],
             min_qualification=args["min_qualification"],
             apply_link=["apply_link"])
    db.session.add(a)
    db.session.commit()

    return {"message": "Added Successfully"}, 201


  
  @jwt_required()
  def delete(self):
    args = job_detail_parser.parse_args()
    jobs.query.filter_by(Job_id=args["Job_id"]).delete()
    db.session.commit()
    return {"message": "Job deleted successfully"}, 200


  
  @jwt_required()
  def put(self):
    args = job_detail_parser.parse_args()
    data = jobs.query.filter_by(Job_id=args["Job_id"])
    if data is None:
      return {"message": "job id doesn't exist"}, 404

    if args["job_title"] == "" or args["job_decription"]:
      return {"message": "Enter valid details"}, 405

    data.Job_Title, data.Job_Description, data.min_Job_salary, data.Skills_require, data.min_qualification, data.apply_link = args[
      "job_title"], args["job_decription"], args["min_salary"], args[
        "skills_required"], args["min_qualification"], ["apply_link"]
    db.session.commit()

    data_new = jobs.query.all()
    if len(data) == 0:
      return {"message": "Jobs not found"}, 404
    data_list = []
    for i in data_new:
      job_detail = [
        i.Job_id, i.Job_Title, i.Job_Description, i.Job_location,
        i.min_Job_salary, i.Skills_require, i.min_qualification
      ]
      data_list.append(job_detail)
    return {"message": "updated Successfully", "jobs": data_list}, 200





class Workshop_module(Resource):
  @jwt_required()
  def get(self):
    data = Workshop.query.all()
    if len(data) == 0:
      return {"message": "Workshop not found"}, 404
    data_list = []
    for i in data:
      workshop_detail = [
        i.workshop_id, i.workshop_title, i.workshop_description,
        i.workshop_registration_link, i.workshop_date
      ]
      data_list.append(workshop_detail)
    return {"message": "Success", "workshops": data_list}, 200


  
  @jwt_required()
  def post(self):
    args = workshop_detail_parser.parse_args()
    ## HANDLE REDUNDANCY

    if args["workshop_title"] == "" or args["workshop_description"] == "":
      return {"message": "Enter valid details"}, 405
    a = Workshop(workshop_title=args["workshop_title"],
                 workshop_description=args["workshop_description"],
                 workshop_registration_link=args["workshop_registration_link"])
    db.session.add(a)
    db.session.commit()

    return {"message": "Workshop Added Successfully"}, 201


  @jwt_required()
  def delete(self):
    args = job_detail_parser.parse_args()
    Workshop.query.filter_by(workshop_id=args["workshop_id"]).delete()
    db.session.commit()
    return {"message": "Workshop deleted successfully"}, 200


  @jwt_required()
  def put(self):
    args = workshop_detail_parser.parse_args()
    data = Workshop.query.filter_by(workshop_id=args["workshop_id"])
    if data is None:
      return {"message": "Workshop id doesn't exist"}, 404

    if args["workshop_title"] == "" or args["workshop_description"]:
      return {"message": "Enter valid details"}, 405

    data.workshop_title, data.workshop_description, data.workshop_registration_link, data.workshop_date = args[
      "workshop_title"], args["workshop_description"], args[
        "workshop_registration_link"], args["workshop_date"]
    db.session.commit()

    data_new = Workshop.query.all()
    if len(data) == 0:
      return {"message": "Jobs not found"}, 404
    data_list = []
    for i in data_new:
      workshop_detail = [
        i.workshop_id, i.workshop_title, i.workshop_description,
        i.workshop_registration_link, i.workshop_date
      ]
      data_list.append(workshop_detail)
    return {"message": "updated Successfully", "Workshops": data_list}, 200



class Change_password_student(Resource):
  @jwt_required()
  def put(self):
    args = login_or_signup_parser.parse_args()
    data = Student.query.filter_by(email=args['Email']).first()
    if data is None:
      return {"message":"user not found"},404

    if data.password == args["Password"]:
      data.password = args["New_Password"]
      db.session.commit()
      return {"message":"Password Changed Successfully"},200

    return {"message":"Something went wrong"}, 500


class Change_password_admin(Resource):
  @jwt_required()
  def put(self):
    args = login_or_signup_parser.parse_args()
    data=Admin.query.first()
    if data.password == args["Password"]:
      data.password = args["New_Password"]
      db.session.commit()
      return {"message":"Password Changed Successfully"},200

    return {"message":"Something went wrong"}, 500


class student_connect(Resource):
  @jwt_required()
  def get(self):
    data=Student.query.all()
    

    data_list=[]
    for i in data:
      if i.Linkedin_url is not None:
        data_list.append([i.image_binary_code,i.name,i.Bio,i.Linkedin_url])
        
    if len(data_list)==0:
      return {"message":" no user avaiable to connect"},404
    else:
      return {"message":"Success",  "users":data_list},200



