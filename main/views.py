from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import random
import time
import json
from .models import RoomMember
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

def getToken(request):
    appId = "98f5e6ce7b224732805556566c27010f"
    appCertificate = "02b20d344c0d431190aab5c67dd9b0c7"
    channelName = request.GET.get('channel')
    uid = random.randint(1000, 9999)
    expirationTimeInSeconds = 3600* 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

    return JsonResponse({"token":token, "uid":uid}, safe=False)
def lobby(request):
    context = {

    }
    return render(request, 'main/lobby.html', context)

def room(request):
    context = {

    }

    return render(request, 'main/room.html', context)


@csrf_exempt
def createMember(request):
    data = json.loads(request.body)

    member, created = RoomMember.objects.get_or_create(
        name = data['name'],
        uid = data['UID'],
        room = data['room']
    )
    return JsonResponse({'name': data['name']}, safe=False)

def getMember(request):
    uid = request.GET.get('uid')
    room = request.GET.get('room')

    member = RoomMember.objects.get(uid=uid, room=room)

    name = member.name

    return JsonResponse({'name':member.name}, safe=False)

@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        room=data['room']
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)