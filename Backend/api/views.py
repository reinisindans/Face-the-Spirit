from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication

from django.contrib.auth.models import User

from .models import Game, Question, Answer, UserAnswer, Results
from .serializers import GameSerializer, QuestionSerializer, AnswerSerializer, UserAnswerSerializer, ResultsSerializer, UserSerializer

# Create your views here.
# Views are the 'interface' of the API with the ourside world. Methods/calls to API are defined here

class UserViewSet(viewsets.ModelViewSet):
    queryset= User.objects.all()
    serializer_class= UserSerializer


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Game.objects.all()
    serializer_class= (GameSerializer)
    def update(self, request, *args, **kwargs): # overrides the default update function- user should not be able to update table
        response= {'message': "You are not allowed to update the table"}
        return Response(response, status= status.HTTP_401_UNAUTHORIZED) 
    
    def create(self, request, *args, **kwargs): # overrides the default create function- user should not be able to update table
        response= {'message': "You are not allowed to create enties"}
        return Response(response, status= status.HTTP_401_UNAUTHORIZED)  

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class= (QuestionSerializer)
    authentication_classes = (TokenAuthentication, )
    
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
            # todo Check if user has logged in!!
            user= request.user
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

# No POST methods except our custom method allowed! 
    def update(self, request, *args, **kwargs): # overrides the default update function- user should not be able to update table
        response= {'message': "You are not allowed to update the table"}
        return Response(response, status= status.HTTP_401_UNAUTHORIZED) 
    
    def create(self, request, *args, **kwargs): # overrides the default create function- user should not be able to update table
        response= {'message': "You are not allowed to create enties"}
        return Response(response, status= status.HTTP_401_UNAUTHORIZED)     

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class= (AnswerSerializer)
    def update(self, request, *args, **kwargs): # overrides the default update function- user should not be able to update table
        response= {'message': "You are not allowed to update the table"}
        return Response(response, status= status.HTTP_401_UNAUTHORIZED) 
    
    def create(self, request, *args, **kwargs): # overrides the default create function- user should not be able to update table
        response= {'message': "You are not allowed to create enties"}
        return Response(response, status= status.HTTP_401_UNAUTHORIZED)      

class UserAnswerViewSet(viewsets.ModelViewSet):
    queryset = UserAnswer.objects.all()
    serializer_class= (UserAnswerSerializer) 
    authentication_classes = (TokenAuthentication, )

    # telling what kind of a custom method this will be!
    @action(detail=False, methods=['GET'])
    def getOwnAnswers(self, request):
        # todo get all the answers that belong to this user!!
        user= request.user
        print("user is: ", user)
        response= {'message': ('Welcome, '+ user.username)}
        return Response(response, status = status.HTTP_200_OK)

    def update(self, request, *args, **kwargs): # overrides the default update function- user should not be able to update table, it is being updated in Question Viewset
        response= {'message': "You are not allowed to update the table"}
        return Response(response, status= status.HTTP_401_UNAUTHORIZED) 
    
    def create(self, request, *args, **kwargs): # overrides the default create function- user should not be able to update table
        response= {'message': "You are not allowed to create enties"}
        return Response(response, status= status.HTTP_401_UNAUTHORIZED)  
class ResultsViewSet(viewsets.ModelViewSet):
    queryset = Results.objects.all()
    serializer_class= ResultsSerializer