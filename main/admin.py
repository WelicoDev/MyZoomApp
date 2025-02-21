from django.contrib import admin
from .models import RoomMember

# Customize the display of RoomMember in the Django admin interface
class RoomMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'uid', 'room', 'created_at', 'updated_at')  # Show relevant fields in the list
    search_fields = ('name', 'room')  # Enable search by name and room_name
    list_filter = ('room',)  # Filter by room_name
    ordering = ('-created_at',)  # Order by creation date descending



# Register the RoomMember model with the admin site
admin.site.register(RoomMember, RoomMemberAdmin)
