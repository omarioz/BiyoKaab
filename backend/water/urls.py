from django.urls import path

from water.views import (
    ActivePlanView,
    AIChatView,
    DashboardSummaryView,
    DeviceStatusView,
    GenerateWaterPlanView,
    LatestReadingView,
    SensorHistoryView,
    SensorIngestView,
)

urlpatterns = [
    path("iot/ingest/", SensorIngestView.as_view(), name="sensor-ingest"),
    path("dashboard/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("sensors/history/", SensorHistoryView.as_view(), name="sensor-history"),
    path("devices/status/", DeviceStatusView.as_view(), name="device-status"),
    path("readings/latest/", LatestReadingView.as_view(), name="latest-reading"),
    path("plans/generate/", GenerateWaterPlanView.as_view(), name="generate-plan"),
    path("plans/active/", ActivePlanView.as_view(), name="active-plan"),
    path("ai/chat/", AIChatView.as_view(), name="ai-chat"),
]

