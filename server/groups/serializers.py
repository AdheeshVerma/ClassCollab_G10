from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Group, GroupMembership, Task, Message

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'due_date', 'assigned_to', 'created_at', 'completed_at']

class GroupListSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    tasks_count = serializers.SerializerMethodField()
    tasks_completed_count = serializers.SerializerMethodField()
    recent_activity = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'subject', 'semester', 'members_count', 
                  'tasks_count', 'tasks_completed_count', 'recent_activity']
    
    def get_members_count(self, obj):
        return obj.memberships.count()
    
    def get_tasks_count(self, obj):
        return obj.tasks.count()
    
    def get_tasks_completed_count(self, obj):
        return obj.tasks.filter(status='DONE').count()
    
    def get_recent_activity(self, obj):
        from django.utils import timezone
        diff = timezone.now() - obj.last_activity
        
        if diff.days > 0:
            return f"{diff.days} days ago"
        hours = diff.seconds // 3600
        if hours > 0:
            return f"{hours} hours ago"
        minutes = (diff.seconds % 3600) // 60
        return f"{minutes} minutes ago"

class GroupDetailSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    tasks = TaskSerializer(many=True, read_only=True)
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'subject', 'semester', 'members', 'tasks', 'invite_code']
    
    def get_members(self, obj):
        memberships = obj.memberships.all()
        return [{"id": m.user.id, "username": m.user.username, "role": m.role} for m in memberships]

class GroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'description', 'subject', 'semester']
    
    def create(self, validated_data):
        import random
        import string
        
        # Generate a random 8-digit invite code
        while True:
            invite_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            if not Group.objects.filter(invite_code=invite_code).exists():
                break
        
        group = Group.objects.create(invite_code=invite_code, **validated_data)
        
        # Add the creator as an admin
        user = self.context['request'].user
        GroupMembership.objects.create(user=user, group=group, role='ADMIN')
        
        return group

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    
    class Meta:
        model = Message
        fields = ['id', 'content', 'sender', 'sender_name', 'created_at', 'is_read']