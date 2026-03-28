from django.db import models
from django.contrib.auth.models import User

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="settings")

    # Appearance
    theme = models.CharField(max_length=20, default="LIGHT")   # LIGHT / DARK / AUTO

    # Notifications
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    dashboard_alerts = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} Settings"