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


class Admin(db.Model):
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  password = db.Column(db.String, nullable=False)


class Assesment(db.Model):
  assesment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  assesment_type = db.Column(db.String, nullable=False)
  participants = db.Column(db.String)


class jobs(db.Model):
  Job_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

  Job_Title = db.Column(db.String, nullable=False)
  Job_Description = db.Column(db.String, nullable=False)
  Job_location = db.Column(db.String, nullable=False)
  min_Job_salary = db.Column(db.Integer, nullable=False)
  Skills_require = db.Column(db.String,
                             nullable=False)  # to be converted to list
  min_qualification = db.Column(db.String,
                                nullable=False)  # to be converted to list


class Workshop(db.Model):
  workshop_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  workshop_title = db.Column(db.String, nullable=False)
  workshop_description = db.Column(db.String, nullable=False)
  workshop_registration_link = db.Column(db.String, nullable=False)


class experience(db.Model):
  experience_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  experience_type = db.Column(db.String, nullable=False)
  experience_title = db.Column(db.String, nullable=False)
  roll_number = db.Column(db.Integer)
  url_or_blog = db.Column(db.String)


class Notification(db.Model):
  notification_id = db.Column(db.Integer, primary_key=True)
  notification_message = db.Column(db.String)
