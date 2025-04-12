from django.urls import path
from . import views

urlpatterns = [
    path('', views.quiz_list_view, name='quiz_list'),
    path('create/', views.quiz_create_view, name='quiz_create'),
    path('<int:quiz_id>/test/', views.quiz_test_view, name='quiz_test'),
    path('<int:quiz_id>/results/', views.quiz_results_view, name='quiz_results'),
    path('<int:quiz_id>/delete/', views.delete_quiz_view, name='quiz_delete'),
]
