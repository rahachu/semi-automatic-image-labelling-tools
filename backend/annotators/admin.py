from django.contrib import admin

from .models import AnnotationProject, Image, ImageAnnotation

# Register your models here.
admin.site.register(AnnotationProject)
admin.site.register(Image)
admin.site.register(ImageAnnotation)