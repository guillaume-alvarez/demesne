from django.shortcuts import render, get_object_or_404, get_list_or_404
from .models import Game
import logging

log = logging.getLogger(__name__)

# Create your views here.

def load_game(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    context = { 'game_id': game.id, }
    return render(request, 'game/game.html', context)

def list_games(request):
    context = {'game_list':Game.objects.all()}
    return render(request,'game/games.html',context)