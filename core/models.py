from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.email

#editar perfil

def user_avatar_path(instance, filename):
    return f'avatars/user_{instance.user.id}/{filename}'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to=user_avatar_path, null=True, blank=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"

# Crear automáticamente el perfil cuando se crea un usuario
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()

#BANCOS
class Bank(models.Model):
    CATEGORY_CHOICES = [
        ("Dólares (USD)", "Dólares (USD)"),
        ("Efectivo (USD)", "Efectivo (USD)"),
        ("Efectivo (CAD)", "Efectivo (CAD)"),
        ("Dólares Canadienses (CAD)", "Dólares Canadienses (CAD)"),
        ("Tether (USDT)", "Tether (USDT)"),
        ("Guaraní Paraguayo (PYG)", "Guaraní Paraguayo (PYG)"),
        ("Bancos Digitales (USD)", "Bancos Digitales (USD)"),
        ("Emirates Dirham (AED)", "Emirates Dirham (AED)"),
    ]

    name = models.CharField(max_length=100)
    holder = models.CharField(max_length=100)
    balance = models.DecimalField(max_digits=12, decimal_places=2)
    email = models.EmailField(blank=True, null=True)
    icon = models.TextField(blank=True, null=True)  # base64 string del icono
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)  # NUEVO CAMPO
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.holder}"


#BANCOS TRANSACCIONES
class BankTransaction(models.Model):
    TRANSACTION_TYPES = (
        ("Ingreso", "Ingreso"),
        ("Egreso", "Egreso"),
    )

    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, related_name="transactions")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    date = models.DateTimeField()
    reference = models.CharField(max_length=100, blank=True, null=True)
    concept = models.TextField(blank=True, null=True)
    operator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.amount} - {self.bank.name}"

#CATEGORIAS FINANZAS

class FinanceCategory(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=50, default="#ffffff")  # Hex color
    icon = models.CharField(max_length=10, blank=True)  # Optional emoji

    def __str__(self):
        return self.name

class Transaction(models.Model):
    category = models.ForeignKey(FinanceCategory, on_delete=models.CASCADE, related_name="transactions")
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    type = models.CharField(  # ✅ este campo es necesario
        max_length=10,
        choices=[("Ingreso", "Ingreso"), ("Egreso", "Egreso")],
        default="Ingreso"
    )

    def __str__(self):
        return f"{self.date} - {self.category.name}: ${self.amount}"
