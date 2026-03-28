from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse
from .models import Alert
import csv


# -------------------------------------------
# GET ALL ALERTS  (backend for Alerts.jsx)
# -------------------------------------------
@api_view(["GET"])
def all_alerts(request):
    alerts = Alert.objects.all().order_by("-created_at")[:50]
    data = []
    for a in alerts:
        data.append({
            "id": a.id,
            "device": a.device.name,
            "temperature": a.temperature,
            "vibration": a.vibration,
            "humidity": a.humidity,
            "noise": a.noise,
            "pressure": a.pressure,
            "message": a.message,
            "created_at": a.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        })

    return Response(data)


# -------------------------------------------
# EXPORT CSV
# -------------------------------------------
@api_view(["GET"])
def export_csv(request):
    alerts = Alert.objects.all().order_by("-created_at")[:50]

    # Create the HttpResponse object
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="alerts_export.csv"'

    writer = csv.writer(response)
    writer.writerow(["Device", "Temp", "Vibration", "Humidity", "Noise", "Pressure", "Message", "Time"])

    for a in alerts:
        writer.writerow([
            a.device.name,
            a.temperature,
            a.vibration,
            a.humidity,
            a.noise,
            a.pressure,
            a.message,
            a.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        ])

    return response


# -------------------------------------------
# ALERT COUNT
# -------------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def alert_count(request):

    count = Alert.objects.count()

    return Response({
        "count": count
    })