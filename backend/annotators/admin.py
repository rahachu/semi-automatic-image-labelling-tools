from django.contrib import admin

from .models import AnnotationProject, Image

# Register your models here.
admin.site.register(AnnotationProject)
admin.site.register(Image)