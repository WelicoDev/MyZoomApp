from django.urls import path
from .views import lobby, room, getToken, createMember, getMember, deleteMember


urlpatterns = [
    path('', lobby, name="lobby"),
    path('room/',room, name="room"),
    path('token/', getToken, name="get_token"),
    path('create/member/',createMember, name="create_member"),
    path('member/', getMember, name='get_member'),
    path('delete/member/', deleteMember, name="delete_member")
]