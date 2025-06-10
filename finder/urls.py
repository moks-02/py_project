from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ToiletViewSet
import finder.views as views

router = DefaultRouter()
router.register(r'toilets', ToiletViewSet)

urlpatterns = [
    path('/', include(router.urls)),
    path('about/', views.about_view, name='about'),
    path('favorites/', views.favorites_view, name='favorites'),
    path('help/', views.help_view, name='help'),
    path('', views.index_view, name='index'),
    path('map/', views.map_view, name='map'),
    path('settings/', views.settings_view, name='settings'),
    path('signup/', views.signup_view, name='signup')
]
