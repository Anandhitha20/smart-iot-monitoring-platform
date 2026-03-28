from django.urls import path
from .views import login_view, logout_view, user_profile, update_profile

urlpatterns = [
    path("login/", login_view),
    path("logout/", logout_view),
    path("profile/", user_profile),
    path("update-profile/", update_profile),
]