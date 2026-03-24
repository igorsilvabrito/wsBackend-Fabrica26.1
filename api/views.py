import requests
from datetime import datetime
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import MoedaFavorita, HistoricoCotacao, Alerta
from .serializers import (
    RegistroSerializer,
    MoedaFavoritaSerializer,
    HistoricoCotacaoSerializer,
    AlertaSerializer,
)

AWESOMEAPI_URL = "https://economia.awesomeapi.com.br/last/{}"



def buscar_cotacao(par):
    try:
        response = requests.get(AWESOMEAPI_URL.format(par), timeout=5)
        response.raise_for_status()
        chave = par.replace("-", "")
        return response.json().get(chave)
    except requests.RequestException:
        return None

def auth_view(request):
    return render(request, 'auth.html')

def painel_view(request):
    return render(request, 'painel.html')
def favoritas_view(request):
    return render(request, 'favoritas.html')

def alertas_view(request):
    return render(request, 'alertas.html')

def historico_view(request):
    return render(request, 'historico.html')

class RegistroView(generics.CreateAPIView):
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

class MoedaFavoritaListCreateView(generics.ListCreateAPIView):
    serializer_class = MoedaFavoritaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MoedaFavorita.objects.filter(usuario=self.request.user)


class MoedaFavoritaDestroyView(generics.DestroyAPIView):
    serializer_class = MoedaFavoritaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MoedaFavorita.objects.filter(usuario=self.request.user)

class CotacaoView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, par):
        dados = buscar_cotacao(par.upper())

        if not dados:
            return Response(
                {"erro": f"Par '{par}' não encontrado ou API indisponível."},
                status=status.HTTP_404_NOT_FOUND
            )

        cotacao = HistoricoCotacao.objects.create(
            usuario=request.user,
            par=par.upper(),
            valor_compra=dados.get("bid", 0),
            valor_venda=dados.get("ask", 0),
            variacao=dados.get("pctChange", 0),
        )
        self._verificar_alertas(request.user, par.upper(), float(dados.get("bid", 0)))

        return Response(HistoricoCotacaoSerializer(cotacao).data)

    def _verificar_alertas(self, usuario, par, valor_atual):
        alertas = Alerta.objects.filter(
            usuario=usuario, par=par, ativo=True, disparado=False
        )
        for alerta in alertas:
            ref = float(alerta.valor_referencia)
            disparar = (
                (alerta.tipo == "acima" and valor_atual > ref) or
                (alerta.tipo == "abaixo" and valor_atual < ref)
            )
            if disparar:
                alerta.disparado = True
                alerta.disparado_em = datetime.now()
                alerta.save()

class HistoricoView(generics.ListAPIView):
    serializer_class = HistoricoCotacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HistoricoCotacao.objects.filter(usuario=self.request.user)

class AlertaListCreateView(generics.ListCreateAPIView):

    serializer_class = AlertaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Alerta.objects.filter(usuario=self.request.user)


class AlertaDestroyView(generics.DestroyAPIView):
    serializer_class = AlertaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Alerta.objects.filter(usuario=self.request.user)
    
class MoedaFavoritaUpdateView(generics.UpdateAPIView):
    serializer_class = MoedaFavoritaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MoedaFavorita.objects.filter(usuario=self.request.user)

