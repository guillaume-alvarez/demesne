from django.db import models

# Create your models here.


class Type(models.Model):
    name = models.CharField(max_length=128, db_index=True, unique=True)
    slug = models.SlugField(max_length=128, db_index=True, unique=True)
    description = models.CharField(max_length=128, null=True)
    mandatory = models.BooleanField(default=False, help_text='The type will be present in all games.')
    start_number = models.IntegerField(default=10, help_text='Number of times this type can be bought in a game.')
    end_game = models.BooleanField(default=False, help_text='The game ends when this type can no longer be bought.')
    cost = models.IntegerField()
    add_slot = models.IntegerField(default=0)
    add_gold = models.IntegerField(default=0)
    add_points = models.IntegerField(default=0)
    add_buy = models.IntegerField(default=0)
    add_move = models.IntegerField(default=0)
    special_effects = models.CharField(max_length=128, null=True)
    need_slot = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.__str__()


class Game(models.Model):
    name = models.CharField(max_length=128, db_index=True, unique=True)
    nb_players = models.IntegerField()
    map_height = models.IntegerField()
    map_width = models.IntegerField()
    # need the model name as it is not yet defined, do not need the reverse mapping
    current_player = models.ForeignKey('Player', related_name='+', null=True)
    winner = models.ForeignKey('Player', related_name='+', null=True)

    def __str__(self):
        return self.name


class Deck(models.Model):
    game = models.ForeignKey(Game, models.CASCADE, related_name='decks')
    type = models.ForeignKey(Type, models.CASCADE)
    nb = models.IntegerField()

    class Meta:
        unique_together = index_together = ['game', 'type']


class Player(models.Model):
    INITIAL_BUY = 1
    INITIAL_GOLD = 7
    INITIAL_POINTS = 3

    name = models.CharField(max_length=128, db_index=True, unique=True)
    game = models.ForeignKey(Game)
    gold = models.IntegerField(default=INITIAL_GOLD)
    points = models.IntegerField(default=INITIAL_POINTS)
    turn_gold = models.IntegerField(default=INITIAL_GOLD-INITIAL_POINTS)
    turn_buy = models.IntegerField(default=INITIAL_BUY)

    def __str__(self):
        return self.name


class Node(models.Model):
    game = models.ForeignKey(Game)
    player = models.ForeignKey(Player, null=True)
    x = models.IntegerField()
    y = models.IntegerField()
    places = models.ManyToManyField(Type, through='Place')
    active = models.BooleanField(default=True)

    def __str__(self):
        return '(%d, %d)' % (self.x, self.y)

    def __repr__(self):
        return self.__str__()

    neighbours_delta = [(x, y) for x in range(-1, 1) for y in range(-1, 1)]
    neighbours_delta.remove((0, 0))

    def neighbours(self):
        """
        :return: yields the neighbours for this node
        """
        # use yield to reduce the number of requests
        for (dx, dy) in Node.neighbours_delta:
            nx = dx + self.x
            ny = dy + self.y
            if 0 <= nx <= self.game.map_width and 0 <= ny <= self.game.map_height:
                yield Node.objects.get(game_id=self.game_id, x=nx, y=ny)


class Place(models.Model):
    node = models.ForeignKey(Node, models.CASCADE)
    type = models.ForeignKey(Type, models.CASCADE, related_name='+')

    def __str__(self):
        return self.type.name