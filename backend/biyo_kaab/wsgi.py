import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "biyo_kaab.settings")

application = get_wsgi_application()

