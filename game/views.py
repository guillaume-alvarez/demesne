from django.shortcuts import render, get_object_or_404, get_list_or_404, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .models import Game,Player
from django.contrib.auth.models import User
from django.http import HttpResponse
from .form import RegistrationForm

import logging
log = logging.getLogger(__name__)

# Create your views here.


def register(request):
    form = RegistrationForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            user = form.save()
            user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
            login(request, user)
            return redirect('list_games')

    context = {'form':form}
    return render(request, 'game/register.html', context)


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
