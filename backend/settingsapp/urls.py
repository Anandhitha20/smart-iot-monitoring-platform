from django.urls import path
from .views import get_settings, update_settings, change_password

urlpatterns = [
    path("get/", get_settings),
    path("update/", update_settings),
    path("change-password/", change_password),
]