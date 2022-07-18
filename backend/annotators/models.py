from email.mime import image
from django.conf import settings
from django.db import models

# Create your models here.
class AnnotationProject(models.Model):
    title = models.CharField('project title', max_length = 100)
    description = models.TextField('project description')
    owner = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE,
      related_name='owner'
    )
    annotator = models.ManyToManyField(
      settings.AUTH_USER_MODEL,
      related_name='annotator'
    )

class Image(models.Model):
    image = models.ImageField(upload_to='images')
    upload_date = models.DateTimeField('date uploaded', auto_now_add=True)
    project = models.ForeignKey(AnnotationProject, on_delete=models.CASCADE)

class ImageAnnotation(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
      settings.AUTH_USER_MODEL,
      on_delete=models.CASCADE
    )
    # will be following M-RCNN inference result
    # polygon = models.po
    # point = 
    # bounding
