from flask import jsonify
from flask_restful import Resource

class LoginAPI(Resource):

    def get(self):
        return {"message": "Hello_World"}, 200
