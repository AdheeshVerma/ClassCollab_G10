from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from .models import Group, GroupMembership, Task, Message
from .serializers import (
    GroupListSerializer, 
    GroupDetailSerializer, 
    GroupCreateSerializer,
    TaskSerializer,
    MessageSerializer
)

class IsGroupMember(permissions.BasePermission):
    """Permission to check if user is a member of the group"""
    
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Group):
            return obj.memberships.filter(user=request.user).exists()
        return obj.group.memberships.filter(user=request.user).exists()

class IsGroupAdmin(permissions.BasePermission):
    """Permission to check if user is an admin of the group"""
    
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Group):
            return obj.memberships.filter(user=request.user, role='ADMIN').exists()
        return obj.group.memberships.filter(user=request.user, role='ADMIN').exists()

class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only return groups the user is a member of
        return Group.objects.filter(memberships__user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return GroupCreateSerializer
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return GroupDetailSerializer
        return GroupListSerializer
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsGroupAdmin()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard summary stats for the current user"""
        user = request.user
        
        # Get groups the user is a member of
        groups_count = user.group_memberships.count()
        
        # Calculate upcoming deadlines (tasks due in the next 7 days)
        upcoming_deadlines = Task.objects.filter(
            group__memberships__user=user,
            due_date__gte=timezone.now(),
            due_date__lte=timezone.now() + timezone.timedelta(days=7),
            status__in=['TODO', 'IN_PROGRESS']
        ).count()
        
        # Calculate unread messages
        unread_messages = Message.objects.filter(
            group__memberships__user=user,
            is_read=False
        ).exclude(sender=user).count()
        
        # Calculate completed tasks
        completed_tasks = Task.objects.filter(
            group__memberships__user=user,
            status='DONE'
        ).count()
        
        return Response({
            'active_groups': groups_count,
            'upcoming_deadlines': upcoming_deadlines,
            'new_messages': unread_messages,
            'tasks_completed': completed_tasks
        })
    
    @action(detail=False, methods=['post'])
    def join(self, request):
        """Join a group using an invite code"""
        invite_code = request.data.get('invite_code')
        if not invite_code:
            return Response({'error': 'Invite code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            group = Group.objects.get(invite_code=invite_code)
        except Group.DoesNotExist:
            return Response({'error': 'Invalid invite code'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user is already a member
        if group.memberships.filter(user=request.user).exists():
            return Response({'error': 'You are already a member of this group'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Add user as a member
        GroupMembership.objects.create(user=request.user, group=group, role='MEMBER')
        
        return Response({'success': 'Successfully joined the group'})

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsGroupMember]
    
    def get_queryset(self):
        return Task.objects.filter(group__memberships__user=self.request.user)
    
    def perform_create(self, serializer):
        group_id = self.request.data.get('group')
        group = Group.objects.get(id=group_id)
        
        # Check if user is a member of the group
        if not group.memberships.filter(user=self.request.user).exists():
            raise permissions.PermissionDenied("You are not a member of this group")
        
        serializer.save(group=group)
        
        # Update group's last activity
        group.save()  # This will update the auto_now field
    
    @action(detail=True, methods=['post'])
    def mark_complete(self, request, pk=None):
        task = self.get_object()
        task.status = 'DONE'
        task.completed_at = timezone.now()
        task.save()
        
        # Update group's last activity
        task.group.save()
        
        return Response({'status': 'Task marked as complete'})

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsGroupMember]
    
    def get_queryset(self):
        return Message.objects.filter(group__memberships__user=self.request.user)
    
    def perform_create(self, serializer):
        group_id = self.request.data.get('group')
        group = Group.objects.get(id=group_id)
        
        # Check if user is a member of the group
        if not group.memberships.filter(user=self.request.user).exists():
            raise permissions.PermissionDenied("You are not a member of this group")
        
        serializer.save(sender=self.request.user, group=group)
        
        # Update group's last activity
        group.save()
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        message = self.get_object()
        message.is_read = True
        message.save()
        return Response({'status': 'Message marked as read'})