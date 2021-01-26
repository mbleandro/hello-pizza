from django.contrib import admin

from core.models import ActivityLog, Product


class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('type', 'logged_user', 'created_at')


admin.site.register(ActivityLog, ActivityLogAdmin)
admin.site.register(Product)

