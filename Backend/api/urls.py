from django.contrib import admin
from django.urls import path
from rest_framework import routers
from django.conf.urls import include

from .views import GameViewSet, QuestionViewSet, AnswerViewSet, UserAnswerViewSet, ResultsViewSet, UserViewSet

router= routers.DefaultRouter()

# registering routes
router.register("games", GameViewSet)
router.register("questions", QuestionViewSet)
router.register("answers", AnswerViewSet)
router.register("userAnswers", UserAnswerViewSet)
router.register("results", ResultsViewSet)
router.register("users", UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
