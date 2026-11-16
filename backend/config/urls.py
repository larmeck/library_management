
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from books.views import MeView, LogoutView


urlpatterns = [

    path("admin/", admin.site.urls),
    path("api/login/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("api/me/", MeView.as_view()),
    path("api/logout/", LogoutView.as_view()),
    path("api/", include("books.urls")),

]
