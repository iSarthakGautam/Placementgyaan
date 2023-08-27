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
student_profile_parser.add_argument('linked_in_url')
student_profile_parser.add_argument('bio')
student_profile_parser.add_argument('age')
student_profile_parser.add_argument('skills')
student_profile_parser.add_argument('current_status')
student_profile_parser.add_argument('qualification')
student_profile_parser.add_argument('image_binary')

job_detail_parser = reqparse.RequestParser()
job_detail_parser.add_argument('job_id')
job_detail_parser.add_argument('job_title')
job_detail_parser.add_argument('job_description')
job_detail_parser.add_argument('job_location')
job_detail_parser.add_argument('apply_link')
job_detail_parser.add_argument('skills_required')
job_detail_parser.add_argument('min_qualification')
job_detail_parser.add_argument('min_salary')

workshop_detail_parser = reqparse.RequestParser()
workshop_detail_parser.add_argument('workshop_id')
workshop_detail_parser.add_argument('workshop_title')
workshop_detail_parser.add_argument('workshop_description')
workshop_detail_parser.add_argument('workshop_mode_location')
workshop_detail_parser.add_argument('workshop_registration_link')
workshop_detail_parser.add_argument('workshop_date')

Test_module_parser = reqparse.RequestParser()
Test_module_parser.add_argument('assesment_name')
Test_module_parser.add_argument('assesment_type')
Test_module_parser.add_argument('assesment_link')
Test_module_parser.add_argument('deadline')
Test_module_parser.add_argument('assesment_id')
Test_module_parser.add_argument('time_limit_seconds')

Experience_module_parser = reqparse.RequestParser()
Experience_module_parser.add_argument('experience_type')
Experience_module_parser.add_argument('experience_title')
Experience_module_parser.add_argument('experience_description')
Experience_module_parser.add_argument('roll_number')
Experience_module_parser.add_argument('experience_id')
Experience_module_parser.add_argument('email')

pyq_module_parser = reqparse.RequestParser()
pyq_module_parser.add_argument('test_id')
pyq_module_parser.add_argument('paper_name')
pyq_module_parser.add_argument('paper_description')
pyq_module_parser.add_argument('paper_pdf_link')
pyq_module_parser.add_argument('user_email')


class Login(Resource):

  def post(self):
    authenticated = False
    args = login_or_signup_parser.parse_args()
    data = Student.query.filter_by(email=args["Email"]).first()
    print(data)
    if data is None:
      return {"message": "No user exisit in database"}, 404
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
    notification_list = []
    for i in data:
      notification_list.append([i.notification_title, i.notification_message])

    return {"message": "Success", "Notification": notification_list}, 200


class AdminLogin(Resource):

  def post(self):
    args = login_or_signup_parser.parse_args()
    data = Admin.query.all()
    password = data[0].password
    print(password)
    if password == args["Password"]:
      access_token = create_access_token(identity=args['Password'])
      return {"message": "Login Success", "access_token": access_token}, 200
    return {"message": "Login failed"}, 401


class Student_Profile(Resource):

  @jwt_required()
  def get(self, email):
    data = Student.query.filter_by(email=email).first()
    if data == None:
      return {"message": "Data Not found"}, 404
    data_list = [
      data.name, data.Linkedin_url, data.Age, data.Bio, data.image_binary_code,
      data.current_status, data.qualification, data.Skills
    ]
    return {"message": "Success", "data": data_list}, 200

  @jwt_required()
  def put(self, email):
    args = student_profile_parser.parse_args()
    data = Student.query.filter_by(email=email).first()

    if data == None:
      return {"message": "User Not found"}, 404
    data.Linkedin_url = args["linked_in_url"]

    data.name, data.Age, data.Bio, data.image_binary_code, data.current_status, data.qualification, data.Skills = args[
      "name"], args["age"], args["bio"], args["image_binary"], args[
        "current_status"], args["qualification"], args["skills"]
    print(args['age'])
    db.session.commit()

    data_list = [
      data.name, data.Linkedin_url, data.Age, data.Bio, data.image_binary_code,
      data.current_status, data.qualification, data.Skills
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
        i.job_id, i.job_title, i.job_description, i.job_location, i.min_salary,
        i.skills_required, i.min_qualification, i.apply_link
      ]
      data_list.append(job_detail)
    return {"message": "Success", "jobs": data_list}, 200

  @jwt_required()
  def post(self):
    args = job_detail_parser.parse_args()
    ## HANDLE REDUNDANCY
    if args["job_title"] == "" or args["job_description"] == "":
      return {"message": "Enter valid details"}, 405

    a = jobs(job_title=args["job_title"],
             job_description=args["job_description"],
             min_salary=int(args["min_salary"]),
             job_location=args["job_location"],
             skills_required=str(args["skills_required"]),
             min_qualification=str(args["min_qualification"]),
             apply_link=args["apply_link"])
    db.session.add(a)
    db.session.commit()

    return {"message": "Added Successfully"}, 201

  @jwt_required()
  def delete(self):
    args = job_detail_parser.parse_args()
    data = jobs.query.filter_by(job_id=args["job_id"])
    if data.first() is None:
      return {"message": "Job doesn't exist"}, 404
    data.delete()
    db.session.commit()
    return {"message": "Job deleted successfully"}, 200

  @jwt_required()
  def put(self):
    args = job_detail_parser.parse_args()
    data = jobs.query.filter_by(job_id=int(args["job_id"])).first()
    if data is None:
      return {"message": "job id doesn't exist"}, 404

    if args["job_title"] == "" or args["job_description"] == "":
      return {"message": "Enter valid details"}, 405
    print(args['job_location'])
    data.job_title, data.job_description, data.min_salary, data.skills_required, data.min_qualification, data.apply_link, data.job_location = args[
      "job_title"], args["job_decription"], args["min_salary"], str(
        args["skills_required"]), str(
          args["min_qualification"]), args["apply_link"], args['job_location']
    db.session.commit()
    # print(data.Job_Title)
    data_new = jobs.query.all()
    if len(data_new) == 0:
      return {"message": "Jobs not found"}, 404
    data_list = []
    for i in data_new:
      job_detail = [
        i.job_id, i.job_title, i.job_description, i.job_location, i.min_salary,
        i.skills_required, i.min_qualification
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
        i.workshop_mode_location, i.workshop_registration_link, i.workshop_date
      ]
      data_list.append(workshop_detail)
    return {"message": "Success", "workshops": data_list}, 200

  @jwt_required()
  def post(self):
    args = workshop_detail_parser.parse_args()

    if args["workshop_title"] == "" or args["workshop_description"] == "":
      return {"message": "Enter valid details"}, 405
    print(args["workshop_registration_link"])
    a = Workshop(workshop_title=args["workshop_title"],
                 workshop_description=args["workshop_description"],
                 workshop_registration_link=args["workshop_registration_link"],
                 workshop_mode_location=args["workshop_mode_location"],
                 workshop_date=args["workshop_date"])
    db.session.add(a)
    db.session.commit()

    return {"message": "Workshop Added Successfully"}, 201

  @jwt_required()
  def delete(self):
    args = workshop_detail_parser.parse_args()
    data = Workshop.query.filter_by(workshop_id=args["workshop_id"])
    if data.first() is None:
      return {"message": "workshop doesn't exist"}, 404

    data.delete()
    db.session.commit()
    return {"message": "Workshop deleted successfully"}, 200


# @jwt_required()

  def put(self):
    args = workshop_detail_parser.parse_args()
    data = Workshop.query.filter_by(workshop_id=args["workshop_id"]).first()
    if data is None:
      return {"message": "Workshop id doesn't exist"}, 404

    if args["workshop_title"] == "" or args["workshop_description"] == "":
      return {"message": "Enter valid details"}, 405

    data.workshop_title, data.workshop_description, data.workshop_registration_link, data.workshop_date, data.workshop_mode_location = args[
      "workshop_title"], args["workshop_description"], args[
        "workshop_registration_link"], args["workshop_date"], args[
          "workshop_mode_location"]
    db.session.commit()

    data_new = Workshop.query.all()
    if len(data_new) == 0:
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
    print("hello")
    args = login_or_signup_parser.parse_args()
    data = Student.query.filter_by(email=args['Email']).first()
    if data is None:
      return {"message": "user not found"}, 404
    print(data.password)
    if data.password == args["Password"]:
      data.password = args["New_Password"]
      db.session.commit()
      return {"message": "Password Changed Successfully"}, 200

    return {"message": "Something went wrong"}, 500


class Change_password_admin(Resource):

  @jwt_required()
  def put(self):
    args = login_or_signup_parser.parse_args()
    data = Admin.query.first()
    if data.password == args["Password"]:
      data.password = args["New_Password"]
      db.session.commit()
      return {"message": "Password Changed Successfully"}, 200

    return {"message": "Something went wrong"}, 500


class student_connect(Resource):

  @jwt_required()
  def get(self):
    data = Student.query.all()

    data_list = []
    for i in data:

      if i.Linkedin_url is not None:
        data_list.append([i.image_binary_code, i.name, i.Bio, i.Linkedin_url])

    if len(data_list) == 0:
      return {"message": " no user avaiable to connect"}, 404
    else:
      return {"message": "Success", "users": data_list}, 200


class Test_module(Resource):

  @jwt_required()
  def get(self):
    data = Assesment.query.all()
    if len(data) == 0:
      return {"message": "No tests available"}, 200

    data_list = []
    for i in data:
      test_details = [
        i.assesment_id, i.assesment_type, i.participants, i.assesment_name,
        i.assesment_link, i.deadline, i.time_limit_seconds
      ]
      data_list.append(test_details)
    return {"message": "Success", "tests": data_list}, 200

  @jwt_required()
  def post(self):
    args = Test_module_parser.parse_args()
    if args["assesment_name"] == "" or args["assesment_type"] == "" or args[
        "assesment_link"] == "":
      return {
        "message":
        "Fields: assesment_name, assesment_type, assesment_link, can't be empty"
      }, 400

    data_old = Assesment.query.filter_by(
      assesment_link=args["assesment_link"]).first()
    if data_old is not None:
      return {"message": "Assement already their. Recheck form link"}, 200

    a = Assesment(assesment_type=args["assesment_type"],
                  assesment_name=args["assesment_name"],
                  assesment_link=args["assesment_link"],
                  deadline=args["deadline"],
                  time_limit_seconds=args["time_limit_seconds"])

    db.session.add(a)
    db.session.commit()

    return {"message": "Test Added Success"}, 201

  @jwt_required()
  def delete(Resource):
    args = Test_module_parser.parse_args()
    data = Assesment.query.filter_by(assesment_id=int(args["assesment_id"]))
    if data.first() is None:
      return {"message": "Test doesn't exist"}, 404
    data.delete()
    db.session.commit()
    return {"message": "Test deleted successfully"}, 200

  @jwt_required()
  def put(Resource):
    args = Test_module_parser.parse_args()
    if args["assesment_name"] == "" or args["assesment_type"] == "" or args[
        "assesment_link"] == "" or args["assesment_id"] == 0:
      return {
        "message":
        "Fields: assesment_name, assesment_type, assesment_link, can't be empty"
      }, 400

    data = Assesment.query.filter_by(
      assesment_id=int(args["assesment_id"])).first()

    if data is None:
      return {"message": "Assesment id doesn't exist"}, 404

    if args["assesment_type"] == "" or args["assesment_name"] == "" or args[
        "assesment_link"] == "":
      return {"message": "Enter valid details"}, 405

    data.assesment_type, data.assesment_name, data.assesment_link, data.deadline, data.time_limit_seconds = args[
      "assesment_type"], args["assesment_name"], args["assesment_link"], args[
        "deadline"], args["time_limit_seconds"]

    db.session.commit()
    data = Assesment.query.all()
    if len(data) == 0:
      return {"message": "No tests available"}, 200

    data_list = []
    for i in data:
      test_details = [
        i.assesment_id, i.assesment_type, i.participants, i.assesment_name,
        i.assesment_link, i.deadline, i.time_limit_seconds
      ]
      data_list.append(test_details)
    return {"message": "Success", "tests": data_list},


class Experience_module(Resource):

  def get(self):
    data = experience.query.all()
    Experiences = []
    if len(data) == 0:
      return {"message": "No experiences available"}, 200
    else:
      for i in data:
        exp_details = [
          i.experience_id, i.experience_type, i.experience_title,
          i.url_or_blog, i.roll_number
        ]
        Experiences.append(exp_details)

    return {"messeage": "success", "Experiences": Experiences}

  def post(self):

    args = Experience_module_parser.parse_args()

    if args["experience_type"] not in ["video", "blog"]:
      return {"message": "Type must be of video or audio type"}, 400

    if args["experience_title"] == "" or args["experience_description"] == "":
      return {
        "message":
        "It should be of video or audio type and title and description should not be empty"
      }, 400

    a = experience(experience_type=args["experience_type"],
                   experience_title=args["experience_title"],
                   roll_number=args["roll_number"],
                   url_or_blog=args["experience_description"])

    db.session.add(a)
    db.session.commit()
    return {"message": "Expereince Added Successfully"}, 200

  def delete(self):
    args = Experience_module_parser.parse_args()
    data = experience.query.filter_by(experience_id=args["experience_id"])

    if data.first() is None:
      return {"message": "Experience Doesn't exist"}, 404

    data.delete()
    db.session.commit()
    return {"message": "Experience deleted"}, 200

  def put(self):
    args = Experience_module_parser.parse_args()
    if args["experience_type"] not in ["video", "blog"]:
      return {"message": "Type must be of video or audio type"}, 400

    if args["experience_title"] == "" or args["experience_description"] == "":
      return {
        "message":
        "It should be of video or audio type and title and description should not be empty"
      }, 400
    data = experience.query.get(int(args['experience_id']))

    if data is None:
      return {"message": "Experience not found"}, 404

    data.experience_type, data.experience_title, data.roll_number, data.url_or_blog = args[
      "experience_type"], args["experience_title"], args["roll_number"], args[
        "experience_description"]

    db.session.commit()

    return {
      "messeage": "Expereince Update Successfully",
    }, 200


class Past_test_module(Resource):

  @jwt_required()
  def get(self):
    data = Past_test.query.all()
    if len(data) == 0:
      return {"message": "No tests available"}, 200

    data_list = []
    for i in data:
      test_details = [
        i.test_id, i.test_name, i.test_description, i.pdf_link, i.owner_email
      ]
      data_list.append(test_details)
    return {"message": "Success", "tests": data_list}, 200

  @jwt_required()
  def post(self):
    args = pyq_module_parser.parse_args()
    if args["paper_name"] == "" or args["paper_description"] == "" or args[
        "paper_pdf_link"] == "" or args["user_email"] == "":
      return {
        "message":
        "Fields: paper_name, paper_description, paper_pdf_link, user_email can't be empty"
      }, 400

    data_old = Past_test.query.filter_by(
      pdf_link=args["paper_pdf_link"]).first()
    if data_old is not None:
      return {"message": "Assement already their. Recheck drive link"}, 200

    a = Past_test(
      test_name=args["paper_name"],
      test_description=args["paper_description"],
      pdf_link=args["paper_pdf_link"],
      owner_email=args["user_email"],
    )

    db.session.add(a)
    db.session.commit()

    return {"message": "Test Added Success"}, 201

  @jwt_required()
  def delete(Resource):
    args = pyq_module_parser.parse_args()
    data = Past_test.query.filter_by(test_id=int(args['test_id']))
    print(data)
    if data.first() and data.first().owner_email == args["user_email"]:
      data.delete()
      db.session.commit()
      return {"message": "Test deleted successfully"}, 200
    else:
      return {"message": "Test doesn't exist or email doesn't match"}, 404

  @jwt_required()
  def put(Resource):
    args = Test_module_parser.parse_args()
    if args["paper_name"] == "" or args["paper_description"] == "" or args[
        "paper_pdf_link"] == "" or args["user_email"] == "":
      return {
        "message":
        "Fields: paper_name, paper_description, paper_pdf_link, user_email can't be empty"
      }, 400

    data = Past_test.query.filter_by(test_id=int(args["test_id"])).first()

    if data is None:
      return {"message": "Test id doesn't exist"}, 404

    data.test_name, data.test_description, data.pdf_link, data.owner_email = args[
      "paper_name"], args["paper_description"], args["paper_pdf_link"], args[
        "user_email"]

    db.session.commit()
    data = Assesment.query.all()
    if len(data) == 0:
      return {"message": "No tests available"}, 200

    data_list = []
    for i in data:
      test_details = [
        i.assesment_id, i.assesment_type, i.participants, i.assesment_name,
        i.assesment_link, i.deadline, i.time_limit_seconds
      ]
      data_list.append(test_details)
    return {"message": "Success", "tests": data_list},


class Student_shared_Experience_module(Resource):

  @jwt_required()
  def get(self):
    data = Student_only_experience.query.all()
    Experiences = []
    if len(data) == 0:
      return {"message": "No experiences available"}, 200
    else:
      for i in data:
        exp_details = [
          i.experience_id, i.experience_type, i.experience_title,
          i.url_or_blog, i.email
        ]
        Experiences.append(exp_details)

    return {"message": "success", "Experiences": Experiences}

  @jwt_required()
  def post(self):

    args = Experience_module_parser.parse_args()

    if args["experience_type"] not in ["video", "blog"]:
      return {"message": "Type must be of video or Text type"}, 400

    if args["experience_title"] == "" or args["experience_description"] == "":
      return {
        "message":
        "It should be of video or Text type and title and description should not be empty"
      }, 400
    print()
    a = Student_only_experience(experience_type=args["experience_type"],
                                experience_title=args["experience_title"],
                                email=args["email"],
                                url_or_blog=args["experience_description"])
    print(a.email)
    db.session.add(a)
    db.session.commit()
    return {"message": "Experience Added Successfully"}, 201

  @jwt_required()
  def delete(self):
    args = Experience_module_parser.parse_args()
    data = Student_only_experience.query.filter_by(
      experience_id=args["experience_id"])

    if data.first() is None:
      return {"message": "Experience Doesn't exist"}, 404

    data.delete()
    db.session.commit()
    return {"message": "Experience deleted"}, 200

  @jwt_required()
  def put(self):
    args = Experience_module_parser.parse_args()
    if args["experience_type"] not in ["video", "blog"]:
      return {"message": "Type must be of video or audio type"}, 400

    if args["experience_title"] == "" or args["experience_description"] == "":
      return {
        "message":
        "It should be of video or audio type and title and description should not be empty"
      }, 400
    data = Student_only_experience.query.get(int(args['experience_id']))

    if data is None:
      return {"message": "Experience not found"}, 404

    data.experience_type, data.experience_title, data.roll_number, data.url_or_blog = args[
      "experience_type"], args["experience_title"], args["roll_number"], args[
        "experience_description"]

    db.session.commit()

    return {
      "messeage": "Expereince Update Successfully",
    }, 200
