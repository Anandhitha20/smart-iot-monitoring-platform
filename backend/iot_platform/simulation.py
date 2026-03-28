import threading
import time
import random
from devices.models import Device, DeviceHistory


def run_simulation():
    while True:
        devices = Device.objects.all()

        for device in devices:
            temp = round(random.uniform(30, 100), 2)
            vib = round(random.uniform(1, 10), 2)
            hum = round(random.uniform(40, 90), 2)
            noise = round(random.uniform(10, 60), 2)
            pressure = round(random.uniform(80, 120), 2)

            device.temperature = temp
            device.vibration = vib
            device.humidity = hum
            device.noise = noise
            device.pressure = pressure

            if temp > 80 or vib > 7 or hum > 85 or noise > 50 or pressure > 110:
                device.status = "Fault"
            else:
                device.status = "Normal"

            device.save()

            DeviceHistory.objects.create(
                device=device,
                temperature=temp,
                vibration=vib,
                humidity=hum,
                noise=noise,
                pressure=pressure,
            )

        time.sleep(5)


def start():
    thread = threading.Thread(target=run_simulation, daemon=True)
    thread.start()