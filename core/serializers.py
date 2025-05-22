from rest_framework import serializers
from .models import User, Bank, BankTransaction, FinanceCategory, Transaction, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'is_admin']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "nombre", "apellido", "email", "avatar"]
        read_only_fields = ["id", "username"]

# BANCOS TRANSACCIONES
class BankTransactionSerializer(serializers.ModelSerializer):
    operator = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = BankTransaction
        fields = ['id', 'bank', 'amount', 'type', 'date', 'reference', 'concept', 'operator', 'created_at']


# BANCOS
class BankSerializer(serializers.ModelSerializer):
    transactions = BankTransactionSerializer(many=True, read_only=True)  # 👈 Agregamos las transacciones al banco

    class Meta:
        model = Bank
        fields = ['id', 'name', 'holder', 'balance', 'email', 'category', 'created_at', 'icon', 'transactions']

# CATEGORÍAS FINANZAS

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'category', 'date', 'amount', 'description', 'type']  # ✅ Agregado 'type'

class FinanceCategorySerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = FinanceCategory
        fields = ['id', 'name', 'color', 'icon', 'transactions']
