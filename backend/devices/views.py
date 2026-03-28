import random
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from devices.simulation import start_simulation_loop, stop_simulation_loop, force_critical_fault
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Device, DeviceHistory
from .serializers import DeviceSerializer
from .history_serializer import DeviceHistorySerializer
from alerts.models import Alert


# ------------------------------------------------------
# DEVICE CRUD VIEWSET
# ------------------------------------------------------
class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all().order_by('-created_at')
    serializer_class = DeviceSerializer


# ------------------------------------------------------
# DASHBOARD STATS API
# ------------------------------------------------------
@api_view(["GET"])
def dashboard_stats(request):
    total_devices = Device.objects.count()
    total_alerts = Alert.objects.count()
    fault_count = Device.objects.filter(status="Fault").count()
    normal_count = Device.objects.filter(status="Normal").count()

    data = {
        "total_devices": total_devices,
        "total_alerts": total_alerts,
        "fault_count": fault_count,
        "normal_count": normal_count,
        "system_health": 0 if total_devices == 0 else round((normal_count / total_devices) * 100, 2)
    }

    return Response(data)


# ------------------------------------------------------
# DEVICE INFO API
# ------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def device_info(request, id):
    try:
        device = Device.objects.get(id=id)
    except Device.DoesNotExist:
        return Response({"error": "Device not found"}, status=404)

    data = {
        "id": device.id,
        "name": device.name,
        "device_model": getattr(device, "device_model", "Unknown"),
        "serial_number": getattr(device, "serial_number", "N/A"),
        "device_location": getattr(device, "device_location", "Unknown"),
        "ip_address": getattr(device, "ip_address", "0.0.0.0"),
        "status": device.status,
        "temperature": float(device.temperature),
        "vibration": float(device.vibration),
        "humidity": float(device.humidity),
        "noise": float(device.noise),
        "pressure": float(device.pressure),
    }

    return Response(data)


# ------------------------------------------------------
# DEVICE HISTORY API
# ------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def device_history(request, id):
    try:
        device = Device.objects.get(id=id)
    except Device.DoesNotExist:
        return Response({"error": "Device not found"}, status=404)

    history = DeviceHistory.objects.filter(device=device).order_by("timestamp")

    response = {
        "timestamps": [h.timestamp.strftime("%Y-%m-%d %H:%M:%S") for h in history],
        "temperature": [h.temperature for h in history],
        "vibration": [h.vibration for h in history],
        "humidity": [h.humidity for h in history],
        "noise": [h.noise for h in history],
        "pressure": [h.pressure for h in history],
    }

    return Response(response)


# ------------------------------------------------------
# SIMULATION BUTTONS (Professional Mode)
# ------------------------------------------------------
@api_view(["POST"])
def start_simulation_view(request):
    start_simulation_loop()
    return Response({"status": "Simulation started"})


@api_view(["POST"])
def stop_simulation_view(request):
    stop_simulation_loop()
    return Response({"status": "Simulation stopped"})


@api_view(["POST"])
def force_fault_view(request):
    force_critical_fault()
    return Response({"status": "Critical fault triggered"})