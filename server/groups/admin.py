from django.contrib import admin
from .models import Group, GroupMembership, Task, Message

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'semester', 'created_at', 'last_activity', 'invite_code')
    search_fields = ('name', 'subject', 'invite_code')
    list_filter = ('semester', 'created_at')
    ordering = ('-last_activity',)

@admin.register(GroupMembership)
class GroupMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'group', 'role', 'joined_at')
    list_filter = ('role', 'joined_at')
    search_fields = ('user__username', 'group__name')
    ordering = ('-joined_at',)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'group', 'assigned_to', 'status', 'due_date', 'created_at', 'completed_at')
    list_filter = ('status', 'due_date')
    search_fields = ('title', 'description', 'group__name', 'assigned_to__username')
    ordering = ('-created_at',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'group', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('sender__username', 'group__name', 'content')
    ordering = ('-created_at',)
