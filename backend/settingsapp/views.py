from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserSettings


# --------------------------------------
# GET USER SETTINGS
# --------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_settings(request):

    settings, created = UserSettings.objects.get_or_create(user=request.user)

    return Response({
        "theme": settings.theme,
        "email": settings.email_notifications,
        "sms": settings.sms_notifications,
        "dashboard": settings.dashboard_alerts,
        "username": request.user.username
    })


# --------------------------------------
# UPDATE USER SETTINGS
# --------------------------------------
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_settings(request):

    settings, created = UserSettings.objects.get_or_create(user=request.user)

    settings.theme = request.data.get("theme", settings.theme)
    settings.email_notifications = request.data.get("email", settings.email_notifications)
    settings.sms_notifications = request.data.get("sms", settings.sms_notifications)
    settings.dashboard_alerts = request.data.get("dashboard", settings.dashboard_alerts)

    settings.save()

    return Response({"message": "Settings updated"})


# --------------------------------------
# CHANGE PASSWORD
# --------------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):

    user = request.user
    old = request.data.get("old_password")
    new = request.data.get("new_password")

    if not user.check_password(old):
        return Response({"error": "Incorrect old password"}, status=400)

    user.set_password(new)
    user.save()

    return Response({"message": "Password changed successfully"})