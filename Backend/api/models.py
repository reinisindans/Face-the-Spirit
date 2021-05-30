from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Game(models.Model):
    title= models.CharField(max_length=50)
    description= models.TextField(max_length=500)
    location= models.CharField(max_length=50)

    def question_count(self):
        #find all questions
        questions= Question.objects.filter(game=self)
        print("Count of questions for game: ", len(questions))
        return(len(questions))

    def max_points(self):
        # find all questions
        questions= Question.objects.filter(game=self)
        points=0
        # calculate the maximum achievable point count
        for question in questions:
            answers= Answer.objects.filter(question=question)
            print("Trying to iterate", answers)
            max_points = max([i.points for i in answers])
            points += max_points
        return points

    def __str__(self):
        return self.title

class Question(models.Model):
    game= models.ForeignKey(Game, on_delete=models.CASCADE)
    text= models.TextField(max_length= 360)
    location= models.CharField(max_length=50)
    def __str__(self):
        return self.text
class Answer(models.Model):
    question= models.ForeignKey(Question, on_delete=models.CASCADE)
    points= models.IntegerField()
    text= models.TextField(max_length=50)
    def __str__(self):
        return (str(self.question) + " : "+ str(self.text))

class UserAnswer(models.Model):
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    answer= models.ForeignKey(Answer, on_delete=models.CASCADE)
    question=models.ForeignKey(Question, on_delete= models.CASCADE)
    points= models.IntegerField()

    class Meta: 
        unique_together = (('user', 'question'), )
        index_together = (('user', 'question'),)

class Results(models.Model):
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    game= models.ForeignKey(Game, on_delete=models.CASCADE)
    points= models.IntegerField()
    tries= models.IntegerField()
    date= models.DateTimeField(auto_now=True)
