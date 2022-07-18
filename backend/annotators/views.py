from django.shortcuts import render

# Create your views here.
from django.http import Http404, HttpResponse
from django.contrib.auth.models import User, Group
from django.db.models import Q

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .permissions import IsOwner
from .models import AnnotationProject, Image, ImageAnnotation
from .serializers import (
    AnnotationProjectSerializer,
    GroupSerializer,
    ImageAnnotationSerializer,
    ImageSerializer,
    UserSerializer
)


def index(request):
    return HttpResponse("Hello, world. You're at the TA index API.")

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProjectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        projectList = AnnotationProject.objects.filter(owner=request.user).order_by('update')
        serializer = AnnotationProjectSerializer(projectList, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = AnnotationProjectSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(
                owner=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_object(self, pk):
        try:
            return AnnotationProject.objects.get(pk=pk)
        except AnnotationProject.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        project = self.get_object(pk)
        serializer = AnnotationProjectSerializer(project, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        project = self.get_object(pk)
        serializer = AnnotationProjectSerializer(
            project,
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        project = self.get_object(pk)
        serializer = AnnotationProjectSerializer(
            project,
            data=request.data,
            context={'request': request},
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        project = self.get_object(pk)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ImageView(APIView):
    def post(self, request):
        serializer = ImageSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.save()
        return Response(serializer.data)

class ImageDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Image.objects.get(pk=pk)
        except Image.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        image = self.get_object(pk)
        serializer = ImageSerializer(image)
        return Response(serializer.data)

class ImageAnnotationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return ImageAnnotation.objects.get(Q(image=pk) & Q(updated_by=user))
        except ImageAnnotation.DoesNotExist:
            try:
                image = Image.objects.get(pk=pk)
                imageAnnotation = ImageAnnotation.objects.create(image=image, updated_by=user)
                return imageAnnotation
            except Image.DoesNotExist:
                raise Http404

    def get(self, request, pk, format=None):
        '''
        This function is to give annotation to an image
        '''
        imageAnnotation = self.get_object(pk, request.user)
        print(imageAnnotation)
        serializer = ImageAnnotationSerializer(imageAnnotation)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        '''
        This function is to give annotation to an image
        '''
        imageAnnotation = self.get_object(pk, request.user)
        serializer = ImageAnnotationSerializer(
            imageAnnotation,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
