from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from django.contrib.auth.models import User

from .models import Game, Question, Answer, UserAnswer, Results
from .serializers import GameSerializer, QuestionSerializer, AnswerSerializer, UserAnswerSerializer, ResultsSerializer

# Create your views here.

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class= (GameSerializer)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class= (QuestionSerializer)
    
    #Adding a custom method to answer the question
    # telling what kind of a custom method this will be!
    @action(detail=True, methods=['POST']) # detail= True means only one specific Answer must be provided
    def answerQuestion(self,request, pk=None):
        question= Question.objects.get(id=pk)
        print(pk, "Answering this question!", question.text)
        # todo create a new user answer!
        if ('answer' in request.data) :
            #get the Answer object based on 
            answer= Answer.objects.get(id=request.data['answer'])
            #user= request.user
  
            # Check if the answer corresponds to question! Parsing to int, otherwise not comparable
            if int(answer.question.id) != int(pk):
                print(pk, " != ", answer.question.id)
                print (answer.question.id != pk)
                response= {'message': "Answer not associated with this question!!"}
                return Response(response, status= status.HTTP_409_CONFLICT) 

            user= User.objects.get(id=1)
            print("user is: ", user)

            # Check if answer already present!
            try:
                userAnswer= UserAnswer.objects.get(user=user.id, question= question.id)
                #translate the database object to JSON
                serializer= UserAnswerSerializer(userAnswer, many=False)
                response= {'message': "Answer already delivered", 'result': serializer.data} # this is the response object
                return Response(response, status= status.HTTP_202_ACCEPTED) 
                
            except:
                #create if non existent
                print("Creating the answer!")
                userAnswer= UserAnswer.objects.create(user=user, question= question, answer=answer, points=answer.points)
                #translate the database object to JSON
                serializer= UserAnswerSerializer(userAnswer, many=False)
                response= {'message': "Answering the question", 'result': serializer.data} # this is the response object
                return Response(response, status= status.HTTP_202_ACCEPTED) 

        else:
            response= {'message': "No answer provided!"} # this is the response object
            return Response(response, status= status.HTTP_204_NO_CONTENT) 
class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class= (AnswerSerializer)    

class UserAnswerViewSet(viewsets.ModelViewSet):
    queryset = UserAnswer.objects.all()
    serializer_class= (UserAnswerSerializer) 

    # telling what kind of a custom method this will be!
    @action(detail=False, methods=['GET'])
    def getOwnAnswers(self, request):
        # todo get all the answers that belong to this user!!
        response= {'message': 'dummy message'}
        return Response(response, sttatus = status.HTTP_200_OK)

class ResultsViewSet(viewsets.ModelViewSet):
    queryset = Results.objects.all()
    serializer_class= ResultsSerializer