from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Game, Question, Answer
from .serializers import GameSerializer, QuestionSerializer, AnswerSerializer

# Create your views here.

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class= (GameSerializer)

class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Question.objects.all()
    serializer_class= (QuestionSerializer)
class AnswerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Answer.objects.all()
    serializer_class= (AnswerSerializer)   

    def answerQuestion(self,request):
        response= {'message': "it's working"}
        return Response(response, status= status.HTTP_202_ACCEPTED)