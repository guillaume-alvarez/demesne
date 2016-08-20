from django.db import models

# Create your models here.


class Type(models.Model):
    name = models.CharField(max_length=128, db_index=True, unique=True)
    slug = models.SlugField(max_length=128, db_index=True, unique=True)
    description = models.CharField(max_length=128, null=True)
    cost = models.IntegerField()
    add_slot = models.IntegerField(default=0)
    add_gold = models.IntegerField(default=0)
    add_buy = models.IntegerField(default=0)
    add_move = models.IntegerField(default=0)
    special_effects = models.CharField(max_length=128, null=True)

    def __str__(self):
        return self.name


class Game(models.Model):
    name = models.CharField(max_length=128, db_index=True, unique=True)
    nb_players = models.IntegerField()
    map_height = models.IntegerField()
    map_width = models.IntegerField()

    def __str__(self):
        return self.name


class Player(models.Model):
    name = models.CharField(max_length=128, db_index=True, unique=True)
    game = models.ForeignKey(Game)
    gold = models.IntegerField(default=0)
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Node(models.Model):
    game = models.ForeignKey(Game)
    player = models.ForeignKey(Player, null=True)
    x = models.IntegerField()
    y = models.IntegerField()
    places = models.ManyToManyField(Type)

