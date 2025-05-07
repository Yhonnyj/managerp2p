from rest_framework import serializers
from .models import Transaction, Client

# ✅ Serializador de Clientes
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["id", "nombre", "email", "telefono", "pais", "direccion"]

# ✅ Serializador de Transacciones
class TransactionSerializer(serializers.ModelSerializer):
    sell_price = serializers.SerializerMethodField()
    profit = serializers.SerializerMethodField()
    client_name = serializers.CharField(source="client.nombre", read_only=True)
    client_data = ClienteSerializer(source="client", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_type', 'usdt', 'usd', 'platform', 'fee',
            'payment_method', 'client', 'client_name', 'client_data',
            'date', 'sell_price', 'profit'
        ]

    def get_sell_price(self, obj):
        try:
            if not obj.usdt or not obj.usd:
                return None

            tipo = str(obj.transaction_type).lower()

            if tipo == "compra":
                return round(obj.usdt / obj.usd, 2)
            elif tipo == "venta":
                return round(obj.usd / obj.usdt, 2)

            return None
        except (ZeroDivisionError, TypeError, AttributeError):
            return None

    def get_profit(self, obj):
        try:
            if obj.usdt is None or obj.usd is None or obj.fee is None or obj.transaction_type is None:
                return None

            fee_amount = (float(obj.usdt) * float(obj.fee)) / 100

            if obj.transaction_type == 'compra':
                return round(float(obj.usdt) - float(obj.usd) - fee_amount, 2)
            else:
                return round(float(obj.usd) - float(obj.usdt) - fee_amount, 2)
        except Exception:
            return None
