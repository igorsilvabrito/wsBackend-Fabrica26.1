from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view()),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('favoritas/', views.MoedaFavoritaListCreateView.as_view()),
    path('favoritas/<int:pk>/', views.MoedaFavoritaDestroyView.as_view()),

    path('cotacao/<str:par>/', views.CotacaoView.as_view()),


    path('historico/', views.HistoricoView.as_view()),

    path('alertas/', views.AlertaListCreateView.as_view()),
    path('alertas/<int:pk>/', views.AlertaDestroyView.as_view()),
]