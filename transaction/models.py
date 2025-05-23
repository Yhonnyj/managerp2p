from django.db import models
from core.models import User  # Importamos User desde core
from cloudinary.models import CloudinaryField
from datetime import date # Importamos date para usar como valor predeterminado

class Client(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    email = models.EmailField(null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    pais = models.CharField(max_length=50, null=True, blank=True)
    direccion = models.TextField(null=True, blank=True)
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "transaction_cliente"

    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.strip().lower()  # 🔒 Normaliza nombre
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre.title()  # 👁️ Se muestra como "Josellys Perez"



class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('compra', 'Compra'),
        ('venta', 'Venta'),
    ]

    PLATFORM_CHOICES = [
        ('Apolo Pay', 'Apolo Pay'),
        ('Binance', 'Binance'),
        ('Bitget', 'Bitget'),
        ('Bybit', 'Bybit'),
        ('Dorado', 'Dorado'),
        ('Kucoin', 'Kucoin'),
        ('Paxful', 'Paxful'),
        ('Otro', 'Otro'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('Banesco', 'Banesco'),
        ('BOA', 'BOA'),
        ('Chase', 'Chase'),
        ('Facebank', 'Facebank'),
        ('Mercantil', 'Mercantil'),
        ('Mony', 'Mony'),
        ('Paypal', 'Paypal'),
        ('Zinli', 'Zinli'),
        ('Zelle', 'Zelle'),
        ('Wally Tech', 'Wally Tech'),
        ('Otro', 'Otro'),
    ]

    transaction_type = models.CharField(
        max_length=10, choices=TRANSACTION_TYPE_CHOICES, default="compra"
    )
    usdt = models.DecimalField(max_digits=10, decimal_places=2)
    usd = models.DecimalField(max_digits=10, decimal_places=2)
    platform = models.CharField(
        max_length=20, choices=PLATFORM_CHOICES, default="Otro"
    )
    fee = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True
    )
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    date = models.DateField(default=date.today)

    @property
    def sell_price(self):
        """Calcula el precio de venta (USD/USDT), evita división por 0"""
        return round(self.usd / self.usdt, 2) if self.usdt > 0 else 0

    @property
    def profit(self):
        """Calcula la ganancia según si es compra o venta"""
        fee_amount = (self.usdt * self.fee) / 100  # ✅ fee se calcula sobre USDT
        if self.transaction_type == 'compra':
            return round(self.usdt - self.usd - fee_amount, 2)
        else:
            return round(self.usd - self.usdt - fee_amount, 2)

    def __str__(self):
        return f"{self.transaction_type} - {self.client} - {self.date}"

#IMAGENES
class ClienteImagen(models.Model):
    cliente = models.ForeignKey("transaction.Client", on_delete=models.CASCADE, related_name="imagenes")
    titulo = models.CharField(max_length=100, blank=True)
    imagen = CloudinaryField("image")
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cliente.nombre} - {self.titulo or 'Imagen'}"
