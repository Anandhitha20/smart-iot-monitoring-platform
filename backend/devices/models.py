from django.db import models
from datetime import datetime


# ===========================
#     DEVICE MODEL
# ===========================
class Device(models.Model):
    name = models.CharField(max_length=100)
    device_model = models.CharField(max_length=100, default="Unknown")
    device_location = models.CharField(max_length=100, default="Unknown")
    serial_number = models.CharField(max_length=100, default="N/A")
    ip_address = models.CharField(max_length=100, default="0.0.0.0")
    
    # SENSOR VALUES
    temperature = models.FloatField(default=0)
    vibration = models.FloatField(default=0)
    humidity = models.FloatField(default=0)
    noise = models.FloatField(default=0)
    pressure = models.FloatField(default=0)

    # Status (Normal / Warning / Fault)
    status = models.CharField(max_length=20, default="Normal")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    # ⭐ Override save() to automatically log history
    def save(self, *args, **kwargs):
        is_new = self.pk is None   # Check if created first time
        super().save(*args, **kwargs)

        # Import inside function → avoids circular import error
        from .models import DeviceHistory

        # Every update creates a history point
        DeviceHistory.objects.create(
            device=self,
            temperature=self.temperature,
            vibration=self.vibration,
            humidity=self.humidity,
            noise=self.noise,
            pressure=self.pressure,
            timestamp=datetime.now()
        )


# ===========================
#     DEVICE HISTORY MODEL
# ===========================
class DeviceHistory(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="history")
    timestamp = models.DateTimeField(auto_now_add=True)

    temperature = models.FloatField()
    vibration = models.FloatField()
    humidity = models.FloatField()
    noise = models.FloatField()
    pressure = models.FloatField()

    def __str__(self):
        return f"{self.device.name} @ {self.timestamp}"