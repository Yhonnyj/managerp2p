import os
import openpyxl
from celery import shared_task
from django.conf import settings
from transaction.models import Transaction

@shared_task
@shared_task
def export_transactions_excel_task():
    ...
    workbook = openpyxl.Workbook()
    sheet = workbook.active
    sheet.title = "Transacciones"

    headers = ["Sell Price", "USDT", "USD", "Fee", "Profit", "Client", "Date", "Platform"]
    sheet.append(headers)

    for t in Transaction.objects.all():
        fee_amount = (t.usdt * t.fee) / 100
        profit = round(
            (t.usdt - t.usd - fee_amount)
            if t.transaction_type == "compra"
            else (t.usd - t.usdt - fee_amount),
            2
        )
        sell_price = round(t.usdt / t.usd, 2) if t.transaction_type == "compra" else round(t.usd / t.usdt, 2)

        sheet.append([
            sell_price,
            float(t.usdt),
            float(t.usd),
            round(fee_amount, 2),
            profit,
            t.client.nombre,
            t.date.strftime('%Y-%m-%d'),
            t.platform
        ])

    # Crear directorio si no existe
    export_dir = os.path.join(settings.MEDIA_ROOT, "exports")
    os.makedirs(export_dir, exist_ok=True)

    # Generar nombre de archivo
    from datetime import datetime
    filename = f"transacciones_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    path = os.path.join(export_dir, filename)

    # Guardar archivo Excel
    workbook.save(path)

    # Retornar la URL accesible
    return os.path.join(settings.MEDIA_URL, "exports", filename)
