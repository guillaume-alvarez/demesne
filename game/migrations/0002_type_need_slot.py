# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-08-26 19:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='type',
            name='need_slot',
            field=models.BooleanField(default=True),
        ),
    ]
