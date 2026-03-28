from django.db import models
from devices.models import Device

class Alert(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Resolved", "Resolved"),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE)

    # Store device name for historical reference (even if device is renamed)
    device_name = models.CharField(max_length=100, default="Unknown")

    # Sensor values when alert occurred
    temperature = models.FloatField()
    vibration = models.FloatField()
    humidity = models.FloatField(default=0)
    noise = models.FloatField(default=0)
    pressure = models.FloatField(default=0)

    # Auto-generated fault message
    message = models.CharField(max_length=255)

    # NEW: Alert status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")

    created_at = models.DateTimeField(auto_now_add=True)

    def generate_message(self):
        reasons = []

        if self.temperature > 80:
            reasons.append("temperature")
        if self.vibration > 5:
            reasons.append("vibration")
        if self.humidity > 70:
            reasons.append("humidity")
        if self.noise > 40:
            reasons.append("noise")
        if self.pressure > 110:
            reasons.append("pressure")

        if not reasons:
            return "No fault detected"

        return "Fault due to high " + " and ".join(reasons)

    def save(self, *args, **kwargs):
        # Ensure device_name always saved
        self.device_name = self.device.name  
        self.message = self.generate_message()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Alert for {self.device.name} ({self.status})"