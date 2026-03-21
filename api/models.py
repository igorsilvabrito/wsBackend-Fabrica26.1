from django.db import models
from django.contrib.auth.models import User

class MoedaFavorita(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='moedas_favoritas')
    par = models.CharField(max_length=10)
    apelido = models.CharField(max_length=50, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'par')
        verbose_name = 'Moeda Favorita'
        verbose_name_plural = 'Moedas Favoritas'

    def __str__(self):
        return f"{self.usuario.username} → {self.par}"


class HistoricoCotacao(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='historico')
    par = models.CharField(max_length=10)
    valor_compra = models.DecimalField(max_digits=12, decimal_places=4)
    valor_venda = models.DecimalField(max_digits=12, decimal_places=4)
    variacao = models.DecimalField(max_digits=6, decimal_places=2) 
    consultado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-consultado_em']
        verbose_name = 'Histórico de Cotação'
        verbose_name_plural = 'Histórico de Cotações'

    def __str__(self):
        return f"{self.par} - R$ {self.valor_compra} em {self.consultado_em:%d/%m/%Y %H:%M}"


class Alerta(models.Model):
    TIPO_CHOICES = [
        ('acima', 'Acima de'),
        ('abaixo', 'Abaixo de'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alertas')
    par = models.CharField(max_length=10)
    tipo = models.CharField(max_length=6, choices=TIPO_CHOICES)
    valor_referencia = models.DecimalField(max_digits=12, decimal_places=4)
    ativo = models.BooleanField(default=True)
    disparado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)
    disparado_em = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Alerta'
        verbose_name_plural = 'Alertas'

    def __str__(self):
        return f"{self.usuario.username} - {self.par} {self.tipo} R$ {self.valor_referencia}"