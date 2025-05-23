from django.contrib.auth.models import User
from django.core.cache import cache
from django.http import JsonResponse
from django.db.models import Sum, Case, When, F, DecimalField

from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Bank, BankTransaction, FinanceCategory, Transaction
from .serializers import (
    UserSerializer,
    BankSerializer,
    BankTransactionSerializer,
    FinanceCategorySerializer,
    TransactionSerializer,
)

# 🏠 Home API
def home(request):
    return JsonResponse({"message": "Bienvenido a ManagerP2P API"}, safe=False)


# 👤 Perfil de usuario autenticado (sin Redis por ser por sesión individual)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "nombre": user.first_name,
        "apellido": user.last_name,
        "avatar": user.profile.avatar.url if user.profile.avatar else None
    })



#PERFIL UPDATE

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    user = request.user

    nombre = request.data.get("nombre")
    apellido = request.data.get("apellido")
    email = request.data.get("email")
    avatar = request.data.get("avatar")  # Optional

    if nombre:
        user.first_name = nombre
    if apellido:
        user.last_name = apellido
    if email:
        user.email = email
    if avatar:
        user.profile.avatar = avatar  # Asumiendo que `profile` tiene campo avatar

    user.save()
    if avatar:
        user.profile.save()

    return Response({
        "id": user.id,
        "username": user.username,
        "nombre": user.first_name,
        "apellido": user.last_name,
        "email": user.email,
        "avatar": user.profile.avatar.url if user.profile.avatar else None
    }, status=status.HTTP_200_OK)

# 👥 Usuarios
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# 🏦 Bancos
class BankViewSet(viewsets.ModelViewSet):
    serializer_class = BankSerializer

    def get_queryset(self):
        # ✅ Asegura que se incluyan transacciones en la respuesta
        return Bank.objects.prefetch_related("transactions").order_by("-created_at")

    def list(self, request, *args, **kwargs):
        # ❌ Redis removido temporalmente
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return super().perform_create(serializer)

    def perform_update(self, serializer):
        return super().perform_update(serializer)

    def perform_destroy(self, instance):
        return super().perform_destroy(instance)


# 💳 Transacciones bancarias
class BankTransactionViewSet(viewsets.ModelViewSet):
    serializer_class = BankTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        bank_id = self.kwargs.get('bank_id')
        if bank_id:
            return BankTransaction.objects.filter(bank_id=bank_id).order_by('-date')
        return BankTransaction.objects.none()

    def perform_create(self, serializer):
        serializer.save(operator=self.request.user)


#NUEVA API BANCOS

class BankDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        banks = Bank.objects.all().select_related().order_by("category")

        # Pre-calcular balances por banco
        transactions = (
            BankTransaction.objects.values("bank_id")
            .annotate(
                balance=Sum(
                    Case(
                        When(type="Ingreso", then=F("amount")),
                        When(type="Egreso", then=-F("amount")),
                        output_field=DecimalField()
                    )
                )
            )
        )
        balances = {item["bank_id"]: item["balance"] or 0 for item in transactions}

        # Organizar bancos por categoría
        data = {}
        for bank in banks:
            cat = bank.category
            currency = bank.currency or "$"
            bank_balance = float(balances.get(bank.id, 0))

            if cat not in data:
                data[cat] = {
                    "category": cat,
                    "currency": currency,
                    "total": 0,
                    "banks": [],
                }

            data[cat]["banks"].append({
                "id": bank.id,
                "name": bank.name,
                "holder": bank.holder,
                "icon": bank.icon.url if bank.icon else None,
                "balance": bank_balance,
            })
            data[cat]["total"] += bank_balance

        return Response(list(data.values()))




class FinanceCategoryViewSet(viewsets.ModelViewSet):
    queryset = FinanceCategory.objects.all()
    serializer_class = FinanceCategorySerializer

    @action(detail=True, methods=["post"])
    def transactions(self, request, pk=None):
        category = self.get_object()
        data = request.data.copy()
        data["category"] = category.id

        serializer = TransactionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 💵 Transacciones (vista general)
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


# 📊 Análisis financiero optimizado con Redis
class FinanceAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 🔑 Construir clave de caché con filtros aplicados
        desde = request.query_params.get("desde")
        hasta = request.query_params.get("hasta")
        tipo = request.query_params.get("tipo")
        banco = request.query_params.get("banco")
        monto_minimo = request.query_params.get("monto")

        cache_key = f"finance_dashboard:{desde}:{hasta}:{tipo}:{banco}:{monto_minimo}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        # 🧮 Procesar si no hay caché
        transactions = BankTransaction.objects.select_related("bank")

        if desde:
            transactions = transactions.filter(date__gte=desde)
        if hasta:
            transactions = transactions.filter(date__lte=hasta)
        if tipo:
            transactions = transactions.filter(type=tipo)
        if banco:
            transactions = transactions.filter(bank__name__iexact=banco)
        if monto_minimo:
            try:
                transactions = transactions.filter(amount__gte=float(monto_minimo))
            except ValueError:
                pass

        resumen_mensual = {}
        ingresos_por_banco = {}

        for t in transactions:
            monto = float(t.amount)
            banco_nombre = t.bank.name
            mes = t.date.strftime("%B")

            if mes not in resumen_mensual:
                resumen_mensual[mes] = {"mes": mes, "ingreso": 0, "egreso": 0}

            if t.type == "Ingreso":
                resumen_mensual[mes]["ingreso"] += monto
                ingresos_por_banco[banco_nombre] = ingresos_por_banco.get(banco_nombre, 0) + monto
            else:
                resumen_mensual[mes]["egreso"] += monto

        ingresos_list = [{"banco": k, "ingreso": v} for k, v in ingresos_por_banco.items()]
        resumen_list = list(resumen_mensual.values())

        mayor_banco = max(ingresos_list, key=lambda x: x["ingreso"], default=None)
        mayor_mes = max(resumen_list, key=lambda x: x["egreso"], default=None)
        promedio = resumen_list[0] if resumen_list else {"ingreso": 0, "egreso": 0}

        response_data = {
            "ingresos_por_banco": ingresos_list,
            "ingresos_vs_egresos": resumen_list,
            "banco_mayor_ingreso": mayor_banco,
            "mes_mayor_egreso": mayor_mes,
            "promedio_mensual": promedio,
        }

        # 💾 Guardar en caché por 5 minutos
        cache.set(cache_key, response_data, timeout=300)

        return Response(response_data)
