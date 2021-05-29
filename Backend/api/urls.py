from django.contrib import admin
from django.urls import path
from rest_framework import routers
from django.conf.urls import include

from .views import GameViewSet, QuestionViewSet, AnswerViewSet, UserAnswerViewSet, ResultsViewSet

router= routers.DefaultRouter()

# registering routes
router.register("games", GameViewSet)
router.register("questions", QuestionViewSet)
router.register("answers", AnswerViewSet)
router.register("userAnswers", UserAnswerViewSet)
router.register("results", ResultsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
