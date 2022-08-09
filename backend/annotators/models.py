import json
import re
from django.conf import settings
from django.db import models
from django.core.files.storage import default_storage
from django.core.files.images import get_image_dimensions
import numpy as np

import zipfile
from io import BytesIO

from annotators.types import CocoDatasetType

# Create your models here.

def project_model_weight_dir(instance, _):
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
  licenses = models.JSONField('licenses', default=[{"name": "", "id": 0, "url": ""}])
  created_at = models.DateTimeField('date uploaded', auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def export_to_coco(self):
    stream_file = BytesIO()
    temp_zip_file = zipfile.ZipFile(stream_file, 'w', zipfile.ZIP_DEFLATED, False)
    globalAnnotationId = 1
    coco_base: CocoDatasetType = {
      "info": {
        "year": self.created_at.year,
        "version": "1.0",
        "description": self.description,
        "contributor": self.title,
        "url": "",
        "date_created": self.created_at.strftime('%Y-%m-%d %H:%M:%S')
      },
      "licenses": self.licenses, 
      "images": [],
      "annotations": [],
      "categories": []
    }

    for i, cls in enumerate(self.class_list[1:]):
      coco_base['categories'].append({
        "id": i + 1,
        "name": cls,
        "supercategory": ""
      })

    annotated_images = self.image_set.filter(annotate_by__isnull=False)

    for i, image in enumerate(annotated_images):
      width, height = get_image_dimensions(image.file)
      image_name = image.file.name.split('/')[-1]
      temp_zip_file.write(image.file.path, f'images/{image_name}')
      coco_base['images'].append({
        "id": i,
        "width": width,
        "height": height,
        "file_name": image_name,
        "license": 0,
        "date_captured": image.upload_date.strftime('%Y-%m-%d %H:%M:%S')
      })

      for j, polygon in enumerate(image.polygons):
        bbox = image.boxes[j]
        cls = polygon['cls']
        coco_seg = np.array(polygon['points']) * [width, height]
        list_x = coco_seg[:, 0]
        list_y = coco_seg[:, 1]
        area = 0.5*np.abs(np.dot(list_x,np.roll(list_y,1))-np.dot(list_y,np.roll(list_x,1)))
        coco_base['annotations'].append({
          "id": globalAnnotationId,
          "image_id": i,
          "category_id": self.class_list.index(cls),
          "segmentation": [coco_seg.ravel().tolist()],
          "area": area,
          "bbox": [bbox['x'] * width,bbox['y'] * height,bbox['w'] * width,bbox['h'] * height],
          "iscrowd": 0
        })
        globalAnnotationId = globalAnnotationId + 1

    temp_zip_file.writestr(
      'annotations/instance_default.json',
      json.dumps(coco_base, ensure_ascii=False, indent=4)
    )
    temp_zip_file.close()
    return stream_file.getvalue()

  def export_to_yolo(self):
    stream_file = BytesIO()
    temp_zip_file = zipfile.ZipFile(stream_file, 'w', zipfile.ZIP_DEFLATED, False)
    temp_zip_file.writestr('obj.names', '\n'.join(self.class_list[1:]) + '\n')
    temp_zip_file.writestr('obj.data', '\n'.join([
      f'classes = {len(self.class_list) - 1}',
      'train = data/train.txt',
      'names = data/obj.names',
      ''
    ]))
    
    annotated_images = self.image_set.filter(annotate_by__isnull=False)
    text_data_train = ''

    for image in annotated_images:
      image_name = image.file.name.split('/')[-1]
      text_data_train = text_data_train + f'data/data/{image_name}\n'
      temp_zip_file.write(image.file.path, f'data/{image_name}')
      bbox_text_data = '\n'.join(map(
        lambda bbox: 
          ' '.join([
            str(self.class_list.index(bbox['cls']) - 1),
            str(bbox['x'] + bbox['w'] / 2),
            str(bbox['y'] + bbox['h'] / 2),
            str(bbox['w']),
            str(bbox['h'])
          ]),
        image.boxes
      ))
      temp_zip_file.writestr(f'data/{image_name.split(".")[0]}.txt', bbox_text_data)
    temp_zip_file.writestr('train.txt', text_data_train)
      
    temp_zip_file.close()
    return stream_file.getvalue()

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
  polygons = models.JSONField('annotate polygons', default=[])
  boxes = models.JSONField('annotate boxes', default=[])

  def __str__(self):
        return self.file.path
