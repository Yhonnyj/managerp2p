from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (  
    TransactionViewSet,
    DashboardSummaryView, MonthlyOperationsView, MonthlyNewClientsView, TopClientesView,
    TipoTransaccionSummaryView, UltimasTransaccionesView, PlatformSummaryView, PaymentMethodSummaryView,
    FilteredDashboardSummaryView, ReporteCompletoView,
    ClienteResumenView, ClienteFullListView, ClienteUpdateView, ClienteCreateView, SubirImagenClienteView, 
    ImagenesClienteView, EliminarImagenView,
    
    delete_client,
    export_transactions_to_excel, export_transactions_to_pdf, import_transactions_from_excel,
    export_clients_to_pdf, export_clients_to_excel,
    export_client_transactions_to_excel, export_client_transactions_to_pdf, generar_excel_transacciones, 
)

# ✅ Router para transacciones
router = DefaultRouter()
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    # 📊 Dashboard y Reportes
    path("dashboard/summary/", DashboardSummaryView.as_view()),
    path("dashboard/monthly-summary/", MonthlyOperationsView.as_view()),
    path("dashboard/clientes-por-mes/", MonthlyNewClientsView.as_view()),
    path("dashboard/clientes-ranking/", TopClientesView.as_view()),
    path("dashboard/ultimas-transacciones/", UltimasTransaccionesView.as_view()),
    path("dashboard/plataformas/", PlatformSummaryView.as_view()),
    path("dashboard/metodos-pago/", PaymentMethodSummaryView.as_view()),
    path("dashboard/tipo-transacciones/", TipoTransaccionSummaryView.as_view()),
    path("dashboard/resumen-filtrado/", FilteredDashboardSummaryView.as_view()),
    path("dashboard/reporte-completo/", ReporteCompletoView.as_view()),

    # 🔁 Transacciones
    path('', include(router.urls)),
    path('export/excel/', export_transactions_to_excel),
    path('export/pdf/', export_transactions_to_pdf),
    path('import/excel/', import_transactions_from_excel),
    path('transactions/export/excel/<int:client_id>/', export_client_transactions_to_excel),
    path('transactions/export/pdf/<int:client_id>/', export_client_transactions_to_pdf),

    # 👤 Clientes
    path('clientes/full/', ClienteFullListView.as_view()),               # Todos los clientes (para selects)
    path('clientes/resumen/', ClienteResumenView.as_view()),            # Clientes agrupados por transacciones
    path('clientes/crear/', ClienteCreateView.as_view()),               # Crear nuevo cliente
    path('clientes/<int:client_id>/editar/', ClienteUpdateView.as_view()),
    path('clientes/<int:client_id>/eliminar/', delete_client),
    path("clientes/<int:client_id>/subir-imagen/", SubirImagenClienteView.as_view(), name="subir_imagen_cliente"),
    path("clientes/<int:client_id>/imagenes/", ImagenesClienteView.as_view(), name="imagenes_cliente"),
    path("clientes/imagenes/<int:pk>/eliminar/", EliminarImagenView.as_view(), name="eliminar_imagen_cliente"),

    # 📤 Exportar clientes
    path('clientes/export/pdf/', export_clients_to_pdf),
    path('clientes/export/excel/', export_clients_to_excel),

    path("export/excel/async/", generar_excel_transacciones),
]  # 🚫 Eliminamos rutas duplicadas basadas en funciones

