from rest_framework import serializers
from .models import Game, Question, Answer, UserAnswer, Results

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model= Game
        fields= ("id", "title", "description", "location") 

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model= Question
        fields= ("id", "text", "location", "game")        

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