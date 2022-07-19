from django.urls import path

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

router = routers.SimpleRouter()
router.register(r'inference', views.InferenceEngineView, basename='inference')

urlpatterns = [
    path('', views.index, name='index'),
    path('project', views.ProjectView.as_view()),
    path('project/<int:pk>/', views.ProjectDetailView.as_view()),
    path('image/<int:pk>/annotate', views.ImageAnnotationView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
urlpatterns += router.urls
