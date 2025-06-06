# Generated by Django 5.1.6 on 2025-03-24 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_bank_banktransaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='bank',
            name='category',
            field=models.CharField(choices=[('Dólares (USD)', 'Dólares (USD)'), ('Efectivo (USD)', 'Efectivo (USD)'), ('Efectivo (CAD)', 'Efectivo (CAD)'), ('Dólares Canadienses (CAD)', 'Dólares Canadienses (CAD)'), ('Tether (USDT)', 'Tether (USDT)'), ('Guaraní Paraguayo (PYG)', 'Guaraní Paraguayo (PYG)'), ('Bancos Digitales (USD)', 'Bancos Digitales (USD)'), ('Emirates Dirham (AED)', 'Emirates Dirham (AED)')], default='Dólares (USD)', max_length=50),
            preserve_default=False,
        ),
    ]
