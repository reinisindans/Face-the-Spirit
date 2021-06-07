from rest_framework import serializers
from rest_framework.authtoken.models import Token # have to import the Token model, to be able to automatically create Tokens in code

from django.contrib.auth.models import User

from .models import Game, Question, Answer, UserAnswer, Results

# Serializers 'translate' the models to be served through API to frontend

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields= ("id",'username', "password")
        extra_kwargs = {'password': {'write_only': True, 'required': True}} #adding extra arguments to make password secure
        
    def create(self, validated_data): # create method override (could also be done in Views?)
            user= User.objects.create_user(**validated_data) # built-in method to create a User
            print(user)
            token= Token.objects.create(user=user) # automatically create AuthToken for users when creating user
            print("Token created")
            return {'token': token }

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model= Game
        fields= ("id", "title", "description", "location", "question_count", "max_points") 

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model= Question
        fields= ("id", "text", "location", "game", "radius")        

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model= Answer
        fields= ("id", "question", "text", "points")
 
class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model= UserAnswer
        fields= ("id", "user", "question", "answer", "points")

class ResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model= Results
        fields= ("id", "user", "game", "points", "date")               

