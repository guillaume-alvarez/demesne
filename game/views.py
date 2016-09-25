from django.shortcuts import render, get_object_or_404, get_list_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import Game,Player
from django.contrib.auth.models import User
from django.http import HttpResponse
import logging

log = logging.getLogger(__name__)

# Create your views here.

def create_user(request):
    login = request.GET["login"]
    password = request.GET["password"]
    user = User.objects.create_user(login,None,password)
    user.save()
    return HttpResponse(status=200)

@login_required(login_url="/login/")
def load_game(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    context = { 'game_id': game.id, }
    return render(request, 'game/game.html', context)

@login_required(login_url="/login/")
def list_games(request):
    context = {'game_list':Game.objects.all()}
    return render(request,'game/games.html',context)

@login_required(login_url="/login/")
def join_game(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    user = request.user
    if not game.isUserIn(user.id):
        for player in Player.objects.filter(game=game):
            if player.user is None:
                player.name = user.username
                player.user = user
                player.save()
                break
    return redirect('load_game', game_id=game.id)
