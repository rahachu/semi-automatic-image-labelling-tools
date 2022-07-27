from dataclasses import field
from django.contrib.auth.models import User, Group
from django.core.files.storage import default_storage
from rest_framework import serializers

from annotators.ml_models import MLModelConfig, MRCNNImageEngine

from .models import AnnotationProject, Image


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class MyProjectSerializer(serializers.ModelSerializer):
    annotation_type = serializers.CharField(source='get_annotation_type_display')
    class Meta:
        model = AnnotationProject
        fields = ['id', 'title', 'description', 'class_list', 'class_num', 'annotation_type']

class AnnotationProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(many=False, read_only=True, required=False)
    annotators = UserSerializer(many=True, read_only=True, required=False)
    annotation_type = serializers.CharField(source='get_annotation_type_display', required=False)
    class_list = serializers.JSONField(required=False)
    class_num = serializers.JSONField(required=False)

    def create(self, validated_data):
        annotators = self.initial_data.get('annotators', [])
        if 'class_list' not in validated_data.keys():
            validated_data['class_list'] = MLModelConfig.CLASS_NAMES
        validated_data['class_num'] = len(validated_data['class_list'])
        instance = AnnotationProject.objects.create(**validated_data)
        instance.annotators.set(annotators)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        annotators = self.initial_data.get('annotators', [])
        instance.annotators.set(annotators)
        instance.save()
        return instance


    class Meta:
        model = AnnotationProject
        fields = '__all__'

class ProjectImageSerializer(serializers.ModelSerializer):
    file = serializers.ImageField(required=True)
    annotate_by = UserSerializer(many=False, read_only=True, required=False)

    class Meta:
        model = Image
        fields = ['id', 'file', 'upload_date', 'annotate_at', 'annotate_by']

class ImageSerializer(serializers.ModelSerializer):
    file = serializers.ImageField(required=False)
    project = MyProjectSerializer(many=False, read_only=True, required=False)

    def create(self, validated_data):
        instance = Image(**validated_data)
        ext = instance.file.name.split('.')[-1]
        instance.file.name = f'{instance.project.image_set.count() + 1}.{ext}'
        instance.file.file.name = f'{instance.project.image_set.count() + 1}.{ext}'
        instance.save()
        if instance.project.auto_annotate:
            inferenceEngine = MRCNNImageEngine(instance)
            inferenceEngine.inferenceSegmentation()
        return instance

    def update(self, instance, validated_data):
        if 'file' in validated_data.keys():
            filePath = instance.file.path
            default_storage.delete(filePath)
            file = validated_data['file']
            file.name = filePath
            instance.file = file

        if 'polygons' in validated_data.keys():
            instance.polygons = validated_data['polygons']
            instance.annotate_by = self.context['request'].user

        if 'boxes' in validated_data.keys():
            instance.polygons = validated_data['boxes']
            instance.annotate_by = self.context['request'].user

        instance.save()
        return instance

    class Meta:
        model = Image
        fields = '__all__'
