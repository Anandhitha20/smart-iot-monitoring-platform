from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # Accounts (Login, Logout)
    path("api/accounts/", include("accounts.urls")),

    # Devices
    path("api/devices/", include("devices.urls")),

    # Alerts
    path("api/alerts/", include("alerts.urls")),

    # Settings
    path("api/settings/", include("settingsapp.urls")),
]