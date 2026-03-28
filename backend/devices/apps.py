from django.apps import AppConfig
import threading


class DevicesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'devices'

    def ready(self):
        from .simulation import start_background_loop

        thread = threading.Thread(target=start_background_loop)
        thread.daemon = True
        thread.start()