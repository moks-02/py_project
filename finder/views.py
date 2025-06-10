from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Toilet
from .serializers import ToiletSerializer
from django.shortcuts import render

class ToiletViewSet(viewsets.ModelViewSet):
    queryset = Toilet.objects.all()
    serializer_class = ToiletSerializer

def about_view(request):
    return render(request, 'finder/about.html')
def favorites_view(request):
    return render(request, 'finder/favorites.html')
def help_view(request):
    return render(request, 'finder/help.html')
def index_view(request):
    return render(request, 'finder/index.html')
def map_view(request):
    return render(request, 'finder/map.html')
def settings_view(request):
    return render(request, 'finder/settings.html')
def signup_view(request):
    return render(request, 'finder/signup.html')