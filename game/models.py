from django.db import models

# Create your models here.


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

    def __str__(self):
        return self.name


class Node(models.Model):
    game = models.ForeignKey(Game)
    player = models.ForeignKey(Player, null=True)
    x = models.IntegerField()
    y = models.IntegerField()


class Type(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=128)
    add_slot = models.IntegerField(default=0)
    add_gold = models.IntegerField(default=0)
    add_buy = models.IntegerField(default=0)
    special_effects = models.CharField(max_length=128)

    def __str__(self):
        return self.name


class Place(models.Model):
    node = models.ForeignKey(Node)
    type = models.ForeignKey(Type)
    player = models.ForeignKey(Player)
