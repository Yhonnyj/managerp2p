from django.contrib import admin
from .models import User, Bank, BankTransaction, FinanceCategory, Transaction  # 👈 Agregamos los nuevos modelos

#NUEVO 
from core.models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'name', 'is_admin']
    search_fields = ['email', 'name']

# BANCOS
@admin.register(Bank)
class BankAdmin(admin.ModelAdmin):
    list_display = ('name', 'holder', 'balance', 'email', 'created_at')
    search_fields = ('name', 'holder')
    list_filter = ('created_at',)

@admin.register(BankTransaction)
class BankTransactionAdmin(admin.ModelAdmin):
    list_display = ('bank', 'amount', 'type', 'date', 'operator', 'reference', 'created_at')
    search_fields = ('reference', 'concept', 'bank__name')
    list_filter = ('type', 'date', 'created_at')

# CATEGORÍAS FINANCIERAS
class TransactionInline(admin.TabularInline):
    model = Transaction
    extra = 1

@admin.register(FinanceCategory)
class FinanceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'icon')
    inlines = [TransactionInline]

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('date', 'amount', 'description', 'category')
    list_filter = ('category', 'date')
    search_fields = ('description',)



