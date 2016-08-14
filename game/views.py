from django.shortcuts import render
import logging

log = logging.getLogger(__name__)

# Create your views here.


def index(request):
    return render(request, 'game/main.html')
