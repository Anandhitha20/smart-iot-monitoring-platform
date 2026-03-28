from rest_framework import serializers
from .models import DeviceHistory

class DeviceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceHistory
        fields = "__all__"