class Config:
  SQLALCHEMY_DATABASE_URI = "sqlite:///testdb.sqlite3"
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  
  SECRET_KEY = 'your_flask_secret_key_here'
  JWT_SECRET_KEY = 'your_jwt_secret_key_here'