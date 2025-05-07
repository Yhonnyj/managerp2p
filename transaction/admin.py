from django.contrib import admin
from .models import Transaction, Client  # ✅ Importamos ambos modelos

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("nombre", "email", "telefono", "pais")  # ✅ Muestra estos campos en la tabla
    search_fields = ("nombre", "email", "telefono")  # 🔍 Permite buscar clientes rápido
    list_filter = ("pais",)  # 🔥 Agrega un filtro por país

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("transaction_type", "usdt", "usd", "client", "date")  # ✅ Datos clave en la tabla
    search_fields = ("client__nombre",)  # 🔍 Permite buscar transacciones por cliente
    list_filter = ("transaction_type", "platform", "payment_method")  # 📊 Filtros útiles
