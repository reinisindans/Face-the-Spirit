from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Game(models.Model):
    title= models.CharField(max_length=50)
    description= models.TextField(max_length=500)
    location= models.CharField(max_length=50)
class Question(models.Model):
    id_game= models.ForeignKey(Game, on_delete=models.CASCADE)
    text= models.TextField(max_length= 360)
    location= models.CharField(max_length=50)
class Answer(models.Model):
    id_question= models.ForeignKey(Question, on_delete=models.CASCADE)
    points= models.IntegerField()
    text= models.TextField(max_length=50)
class UserAnswer(models.Model):
    id_user= models.ForeignKey(User, on_delete=models.CASCADE)
    id_answer= models.ForeignKey(Answer, on_delete=models.CASCADE)
    tries= models.IntegerField()

class Results(models.Model):
    id_user= models.ForeignKey(User, on_delete=models.CASCADE)
    id_game= models.ForeignKey(Game, on_delete=models.CASCADE)
    points= models.IntegerField()
    tries= models.IntegerField()
    date= models.DateTimeField(auto_now=True)
