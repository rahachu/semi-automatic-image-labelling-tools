from django.urls import path, re_path

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from annotators.auth.viewsets import LoginViewSet, RefreshViewSet, RegistrationViewSet, current_user
from . import views

router = routers.SimpleRouter(trailing_slash=False)
router.register(r'inference', views.InferenceEngineView, basename='inference')

# AUTHENTICATION
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/register', RegistrationViewSet, basename='auth-register')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
router.register(r'project', views.ProjectView, basename='project')

urlpatterns = [
    path('', views.index, name='index'),
    path('auth', current_user, name='auth'),
    path('project/<int:pk>/images', views.project_image),
    path('project/<int:pk>/export', views.export_project),
    path('project/<int:pk>', views.ProjectDetailView.as_view()),
    path('image', views.ImageView.as_view()),
    path('image/<int:pk>', views.ImageDetailView.as_view()),
    # path('image/<int:pk>/annotate', views.ImageAnnotationView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
urlpatterns += router.urls
