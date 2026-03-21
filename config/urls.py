from django.contrib import admin
from django.urls import path, include
from api.views import auth_view, dashboard_view, favoritas_view, alertas_view, historico_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', auth_view),
    path('dashboard/', dashboard_view),
    path('favoritas/', favoritas_view),
    path('alertas/', alertas_view),
    path('historico/', historico_view),
    path('api/', include('api.urls')),
]