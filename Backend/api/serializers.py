from rest_framework import serializers
from .models import Game, Question, Answer, UserAnswer, Results

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model= Game
        fields= ("id", "title", "description", "location") 

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model= Question
        fields= ("id", "text", "location", "id_game")        

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model= Answer
        fields= ("id", "id_question", "text", "points")
 
class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model= UserAnswer
        fields= ("id", "id_user", "id_answer", "tries")

class ResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model= Results
        fields= ("id", "id_user", "id_game", "points", "tries", "date")               