from django.contrib import admin
from django.urls import path, include
from core.views import home  
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from dj_rest_auth.views import LogoutView, UserDetailsView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # ✅ JWT login, refresh, logout y user
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='rest_logout'),
    path('api/auth/user/', UserDetailsView.as_view(), name='rest_user'),

    path('', home, name="home"),
    path('api/transaction/', include('transaction.urls')),  # Transacciones y clientes
    path('api/', include('core.urls')),  # Usuarios, bancos, finanzas, etc.
]

# ✅ Archivos MEDIA (PDF, Excel, Avatares, etc.)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
