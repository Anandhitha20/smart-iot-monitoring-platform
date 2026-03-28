import os
if os.environ.get('RUN_MAIN') != 'true':
    # Prevent duplicate thread during autoreload
    pass
import time
import random
from django.utils import timezone
from devices.models import Device, DeviceHistory
from alerts.models import Alert

SIMULATION_RUNNING = False  # global flag

def simulate_step():
    """One cycle of simulation"""
    global SIMULATION_RUNNING
    if not SIMULATION_RUNNING:
        print("Simulation paused...")
        return

    print("Simulation running... Updating sensors...")

    devices = Device.objects.all()
    for d in devices:
        d.temperature = round(random.uniform(25, 90), 1)
        d.vibration = round(random.uniform(0.5, 12), 2)
        d.humidity = round(random.uniform(40, 90), 1)
        d.noise = round(random.uniform(10, 50), 1)
        d.pressure = round(random.uniform(85, 130), 1)

        d.status = "Fault" if (
            d.temperature > 80 or
            d.vibration > 5 or
            d.humidity > 70 or
            d.noise > 40 or
            d.pressure > 110
        ) else "Normal"

        d.save()

        DeviceHistory.objects.create(
            device=d,
            temperature=d.temperature,
            vibration=d.vibration,
            humidity=d.humidity,
            noise=d.noise,
            pressure=d.pressure,
            timestamp=timezone.now()
        )

        if d.status == "Fault":
            Alert.objects.create(
                device=d,
                device_name=d.name,
                temperature=d.temperature,
                vibration=d.vibration,
                message="Auto Fault Detected",
                status="Pending",
            )

def start_background_loop():
    """Runs forever in background"""
    print("🔥 Simulation thread started...")
    while True:
        simulate_step()
        time.sleep(5)   # interval in seconds

# Public functions called from views
def start_simulation_loop():
    global SIMULATION_RUNNING
    SIMULATION_RUNNING = True

def stop_simulation_loop():
    global SIMULATION_RUNNING
    SIMULATION_RUNNING = False

def force_critical_fault():
    devices = Device.objects.all()
    for d in devices:
        d.temperature = 95
        d.vibration = 12
        d.humidity = 90
        d.noise = 50
        d.pressure = 130
        d.status = "Fault"
        d.save()

        Alert.objects.create(
            device=d,
            device_name=d.name,
            temperature=d.temperature,
            vibration=d.vibration,
            message="CRITICAL: Forced Fault",
            status="Pending"
        )