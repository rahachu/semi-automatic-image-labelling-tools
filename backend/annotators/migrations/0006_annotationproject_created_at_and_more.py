# Generated by Django 4.0.6 on 2022-07-27 13:36

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('annotators', '0005_alter_image_annotate_by_alter_image_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotationproject',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='date uploaded'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='annotationproject',
            name='licenses',
            field=models.JSONField(default=[], verbose_name='licenses'),
        ),
        migrations.AddField(
            model_name='annotationproject',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
