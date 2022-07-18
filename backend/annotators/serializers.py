from dataclasses import field
from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .models import AnnotationProject, Image, ImageAnnotation


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class AnnotationProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(many=False, read_only=True, required=False)
    annotator = UserSerializer(many=True, read_only=True, required=False)

    def create(self, validated_data):
        annotators = self.initial_data.get('annotator', [])
        instance = AnnotationProject.objects.create(**validated_data)
        instance.annotator.set(annotators)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        annotators = self.initial_data.get('annotator', [])
        instance.annotator.set(annotators)
        instance.save()
        return instance


    class Meta:
        model = AnnotationProject
        fields = ['id', 'title', 'description', 'owner', 'annotator']

class ImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=True)

    class Meta:
        model = Image
        fields = ['image', 'upload_date']

class ImageAnnotationSerializer(serializers.ModelSerializer):
    image = ImageSerializer(many=False, required=False, read_only=True)

    class Meta:
        model = ImageAnnotation
        fields = ['created_at', 'image']
