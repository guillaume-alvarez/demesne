from django.shortcuts import render, get_object_or_404, get_list_or_404
import logging

from .models import Game

log = logging.getLogger(__name__)

# Create your views here.


def index(request):
    return render(request, 'game/main.html')


def load_game(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    context = { 'game_id': game.id, }
    return render(request, 'game/game.html', context)
