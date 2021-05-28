from django.contrib import admin
from django.urls import path
from rest_framework import routers
from django.conf.urls import include

from .views import GameViewSet, QuestionViewSet, AnswerViewSet

router= routers.DefaultRouter()

# registering routes
router.register("games", GameViewSet)
router.register("questions", QuestionViewSet)
router.register("answers", AnswerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
