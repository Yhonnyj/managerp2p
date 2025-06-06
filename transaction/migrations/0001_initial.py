# Generated by Django 5.1.6 on 2025-03-08 02:06

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_type', models.CharField(choices=[('compra', 'Compra'), ('venta', 'Venta')], default='compra', max_length=10)),
                ('usdt', models.DecimalField(decimal_places=2, max_digits=10)),
                ('usd', models.DecimalField(decimal_places=2, max_digits=10)),
                ('platform', models.CharField(choices=[('Apolo Pay', 'Apolo Pay'), ('Binance', 'Binance'), ('Bitget', 'Bitget'), ('Bybit', 'Bybit'), ('Dorado', 'Dorado'), ('Kucoin', 'Kucoin'), ('Paxful', 'Paxful'), ('Otro', 'Otro')], default='Otro', max_length=20)),
                ('fee', models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
                ('payment_method', models.CharField(blank=True, choices=[('Banesco', 'Banesco'), ('BOA', 'BOA'), ('Chase', 'Chase'), ('Facebank', 'Facebank'), ('Mercantil', 'Mercantil'), ('Mony', 'Mony'), ('Paypal', 'Paypal'), ('Zinli', 'Zinli'), ('Zelle', 'Zelle'), ('Wally Tech', 'Wally Tech'), ('Otro', 'Otro')], max_length=20, null=True)),
                ('client', models.CharField(max_length=100)),
                ('date', models.DateField(auto_now_add=True)),
            ],
        ),
    ]
