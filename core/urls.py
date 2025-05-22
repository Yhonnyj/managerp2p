from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserViewSet, 
    user_profile, 
    update_profile,
    BankViewSet, 
    BankTransactionViewSet,
    BankDashboardView,
    FinanceCategoryViewSet,
    TransactionViewSet,
    FinanceAnalyticsView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'banks', BankViewSet, basename='bank')
router.register(r'finance-categories', FinanceCategoryViewSet, basename='finance-category')

# 🔁 CAMBIO CLAVE AQUÍ — ruta estandarizada como el frontend espera
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),

    # Auth
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', user_profile, name='user_profile'),
    path('profile/update/', update_profile, name='update-profile'),

    # Bancos
    path('banks/<int:bank_id>/transactions/', BankTransactionViewSet.as_view({'get': 'list', 'post': 'create'})),
    path(
        'banks/<int:bank_id>/transactions/<int:pk>/',
        BankTransactionViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy',
        })
    ),
    path('banks/dashboard/', BankDashboardView.as_view()),

    # Finanzas - Vista optimizada para análisis
    path('finance/dashboard/', FinanceAnalyticsView.as_view(), name='finance-dashboard'),
]
