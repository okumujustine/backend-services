from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from debug_toolbar.toolbar import debug_toolbar_urls


schema_view = get_schema_view(
    openapi.Info(
        title="backend services API",
        default_version="v1",
        description="API for backend services",
        contact=openapi.Contact(email="okumujustine@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # jwt auth urls
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 

    # apps urls
    path("api/", include("db_table.urls")),

    # explorer urls
    path('explorer/', include('explorer.urls'))
] 
urlpatterns += debug_toolbar_urls()
urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]