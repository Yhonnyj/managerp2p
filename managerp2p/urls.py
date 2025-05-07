from django.contrib import admin
from django.urls import path, include
from core.views import home  
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name="home"),  
    path('api/core/', include('core.urls')),  # ✅ API de autenticación y usuarios
    path('api/transaction/', include('transaction.urls')),  # ✅ API de transacciones y clientes
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
    path('api/', include('core.urls')),  # 👈 Asegúrate de que esta línea esté aquí
]

# ✅ Añadir rutas para archivos media (como Excel o PDF generados por Celery)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


