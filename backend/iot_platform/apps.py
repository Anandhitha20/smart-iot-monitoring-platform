from django.apps import AppConfig
import threading
import os

class IotPlatformConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "iot_platform"

    def ready(self):
        # prevent duplicate threads during autoreload
        if os.environ.get("RUN_MAIN") != "true":
            return

        from devices.simulation import start_background_loop

        thread = threading.Thread(target=start_background_loop, daemon=True)
        thread.start()