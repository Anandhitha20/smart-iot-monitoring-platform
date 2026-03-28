# backend/devices/serializers.py

from rest_framework import serializers
from .models import Device
import random

class DeviceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Device
        fields = "__all__"
        read_only_fields = ["temperature", "vibration", "humidity", "noise", "pressure", "status"]

    def create(self, validated_data):
        # Auto-generate safe defaults (rounded)
        validated_data["temperature"] = round(random.uniform(25, 35), 1)
        validated_data["vibration"] = round(random.uniform(0.5, 1.5), 2)
        validated_data["humidity"] = round(random.uniform(40, 60), 1)
        validated_data["noise"] = round(random.uniform(10, 25), 1)
        validated_data["pressure"] = round(random.uniform(85, 105), 1)
        validated_data["status"] = "Normal"
        return super().create(validated_data)