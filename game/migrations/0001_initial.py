# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-08-15 11:37
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=128, unique=True)),
                ('nb_players', models.IntegerField()),
                ('map_height', models.IntegerField()),
                ('map_width', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.IntegerField()),
                ('y', models.IntegerField()),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.Game')),
            ],
        ),
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('node', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.Node')),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=128, unique=True)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.Game')),
            ],
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('description', models.CharField(max_length=128)),
                ('add_slot', models.IntegerField(default=0)),
                ('add_gold', models.IntegerField(default=0)),
                ('add_buy', models.IntegerField(default=0)),
                ('special_effects', models.CharField(max_length=128)),
            ],
        ),
        migrations.AddField(
            model_name='place',
            name='player',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.Player'),
        ),
        migrations.AddField(
            model_name='place',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.Type'),
        ),
        migrations.AddField(
            model_name='node',
            name='player',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.Player'),
        ),
    ]
