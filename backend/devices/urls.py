from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DeviceViewSet,
    dashboard_stats,
    device_info,
    device_history,
    start_simulation_view,
    stop_simulation_view,
    force_fault_view
)

router = DefaultRouter()
router.register(r'devices', DeviceViewSet, basename='devices')

urlpatterns = [
    path("", include(router.urls)),

    path("dashboard/", dashboard_stats),
    path("device/<int:id>/", device_info),
    path("device/<int:id>/history/", device_history),

    # Simulation controls
    path("sim/start/", start_simulation_view),
    path("sim/stop/", stop_simulation_view),
    path("sim/force-fault/", force_fault_view),
]