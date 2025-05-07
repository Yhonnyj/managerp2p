from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Establece el settings de Django por defecto para el celery
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "managerp2p.settings")

app = Celery("managerp2p")

# Carga configuración desde settings.py con prefijo CELERY_
app.config_from_object("django.conf:settings", namespace="CELERY")

# Autodiscover para que busque tareas en cada app
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f"📌 Tarea ejecutada: {self.request!r}")
