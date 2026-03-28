from django.urls import path
from .views import all_alerts, export_csv, alert_count

urlpatterns = [
    path("", all_alerts),
    path("export/", export_csv),
    path("count/", alert_count),  # 🔥 ADD THIS
]