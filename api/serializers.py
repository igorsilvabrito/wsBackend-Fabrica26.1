from rest_framework import serializers
from django.contrib.auth.models import User
from .models import MoedaFavorita, HistoricoCotacao, Alerta


class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class MoedaFavoritaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoedaFavorita
        fields = ['id', 'par', 'apelido', 'criado_em']
        read_only_fields = ['criado_em']

    def create(self, validated_data):
        usuario = self.context['request'].user
        return MoedaFavorita.objects.create(usuario=usuario, **validated_data)


class HistoricoCotacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricoCotacao
        fields = ['id', 'par', 'valor_compra', 'valor_venda', 'variacao', 'consultado_em']
        read_only_fields = fields


class AlertaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerta
        fields = ['id', 'par', 'tipo', 'valor_referencia', 'ativo', 'disparado', 'criado_em', 'disparado_em']
        read_only_fields = ['disparado', 'criado_em', 'disparado_em']

    def create(self, validated_data):
        usuario = self.context['request'].user
        return Alerta.objects.create(usuario=usuario, **validated_data)
