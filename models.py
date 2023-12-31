from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Student(db.Model):
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String, nullable=False)
  password = db.Column(db.String, nullable=False)
  roll_number = db.Column(db.String, unique=True)
  Linkedin_url = db.Column(db.String)
  Age = db.Column(db.Integer)
  Bio = db.Column(db.String)
  Skills = db.Column(db.String)
  qualification = db.Column(db.String)
  tests_attempted = db.Column(db.String)
  current_status = db.Column(db.String)
  email = db.Column(db.String, unique=True)
  image_binary_code = db.Column(db.Text)


class Admin(db.Model):
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  password = db.Column(db.String, nullable=False)


class Assesment(db.Model):
  assesment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  assesment_type = db.Column(db.String, nullable=False)
  participants = db.Column(db.String)
  assesment_name = db.Column(db.String, nullable=False)
  assesment_link = db.Column(db.String, nullable=False, unique=True)
  deadline = db.Column(db.String)
  time_limit_seconds = db.Column(db.Integer)


class jobs(db.Model):
  job_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

  job_title = db.Column(db.String, nullable=False)
  job_description = db.Column(db.String, nullable=False)
  job_location = db.Column(db.String, nullable=False)
  min_salary = db.Column(db.Integer, nullable=False)
  skills_required = db.Column(db.String, nullable=False)  # to be converted to list
  min_qualification = db.Column(db.String, nullable=False)  # to be converted to list
  apply_link = db.Column(db.String)


class Workshop(db.Model):
  workshop_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  workshop_title = db.Column(db.String, nullable=False)
  workshop_description = db.Column(db.String, nullable=False)
  workshop_mode_location = db.Column(db.String)
  workshop_registration_link = db.Column(db.String)
  workshop_date = db.Column(db.String)


class experience(db.Model):
  experience_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  experience_type = db.Column(db.String, nullable=False)
  experience_title = db.Column(db.String, nullable=False)
  url_or_blog = db.Column(db.String)


class Student_only_experience(db.Model):
  #this db maintains a separate copy for student only data base
  experience_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  experience_type = db.Column(db.String, nullable=False)
  experience_title = db.Column(db.String, nullable=False)
  email = db.Column(db.String)
  url_or_blog = db.Column(db.String)


class Notification(db.Model):
  notification_id = db.Column(db.Integer, primary_key=True)
  notification_title = db.Column(db.String)
  notification_message = db.Column(db.String)


class Past_test(db.Model):
  test_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  test_name = db.Column(db.String)
  test_description = db.Column(db.String)
  pdf_link = db.Column(db.String)
  owner_email = db.Column(db.String)
