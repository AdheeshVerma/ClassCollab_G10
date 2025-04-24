from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GroupViewSet, TaskViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'groups', GroupViewSet, basename='group')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
]