import re
from django.conf import settings
from django.db import models
from django.core.files.storage import default_storage
from traitlets import default

# Create your models here.

def project_model_weight_dir(instance):
  file_name_prefix = re.sub(r"[^\w\s]", '', instance.title.lower())

  file_name_prefix = re.sub(r"\s+", '_', file_name_prefix)
  return f'{instance.id}/{file_name_prefix}_weight.h5'

class AnnotationProject(models.Model):
  ANNOTATION_TYPES = [
    ('PT', 'Point'),
    ('PL', 'Polygon'),
    ('BB', 'Bounding Box')
  ]
  title = models.CharField('project title', max_length = 100)
  description = models.TextField('project description')
  owner = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='owner'
  )
  annotators = models.ManyToManyField(
    settings.AUTH_USER_MODEL,
    related_name='annotators'
  )
  auto_annotate = models.BooleanField('auto annotate', default=False)
  annotation_type = models.CharField(choices=ANNOTATION_TYPES, max_length=2, default='PL')
  is_video = models.BooleanField('is video', default=False)
  class_list = models.JSONField('class list')
  class_num = models.IntegerField('class number')
  file_weight = models.FileField('model weight', null=True, blank=True, upload_to=project_model_weight_dir)
  licenses = models.JSONField('licenses', default=[])

  def __str__(self):
        return self.title

def image_dir(instance, filename):
  finalPath = f'{instance.project.id}/{filename}'
  default_storage.delete(finalPath)
  return finalPath

class Image(models.Model):
  project = models.ForeignKey(AnnotationProject, on_delete=models.CASCADE)
  file = models.ImageField(upload_to=image_dir)
  upload_date = models.DateTimeField('date uploaded', auto_now_add=True)
  annotate_at = models.DateTimeField(auto_now=True)
  annotate_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    blank=True,
    null=True
  )
  polygons = models.JSONField('annotate polygons', blank=True, null=True)
  boxes = models.JSONField('annotate boxes', blank=True, null=True)

  def __str__(self):
        return self.file.path
