import os
import cv2
from django.shortcuts import render

# Create your views here.
from django.http import Http404, HttpResponse
from django.contrib.auth.models import User, Group
from django.db.models import Q

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import action

from backend.settings import BASE_DIR, MODEL_DIR
import tensorflow

from mrcnn import config, model, visualize

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
        projectList = AnnotationProject.objects.filter(owner=request.user)
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

class InferenceEngineView(viewsets.ViewSet):
    class SimpleConfig(config.Config):
        # Give the configuration a recognizable name
        NAME = "coco_inference"
        CLASS_NAMES = ['BG', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']
        
        # set the number of GPUs to use along with the number of images per GPU
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1

        # Number of classes = number of classes + 1 (+1 for the background). The background class is named BG
        NUM_CLASSES = len(CLASS_NAMES)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self.model = model.MaskRCNN(
            mode='inference',
            config=self.SimpleConfig(),
            model_dir=MODEL_DIR
        )

    @action(methods=['get'], detail=False, url_path='get-version', url_name='get_version')
    def get_version(self, request):
        return Response({
            'Tensorflow': tensorflow.__version__,
            'Keras': tensorflow.keras.__version__,
        })

    @action(methods=['get'], detail=False, url_path='image', url_name='get_image')
    def get_image(self, request):
        # print(os.path.join(BASE_DIR, 'ml-model/mask_rcnn_coco.h5'))
        # return Response('test')
        self.model.load_weights(
            filepath=os.path.join(BASE_DIR, 'ml-model/mask_rcnn_coco.h5'),
            by_name=True)

        dbImage = Image.objects.first()

        image = cv2.imread(dbImage.image.path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        r = self.model.detect([image])

        return Response(r[0]['masks'])
