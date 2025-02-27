# converter/urls.py
from django.urls import path
from .views import ConvertCodeView,SummarizeCodeView,GenerateDocstringView

urlpatterns = [
    path('convert/', ConvertCodeView.as_view(), name='convert-code'),
    path("summarize/", SummarizeCodeView.as_view(), name="code-summarizer"),
    path('generate-docstring/', GenerateDocstringView.as_view(), name='code-docstring'),  # New Endpoint

]
