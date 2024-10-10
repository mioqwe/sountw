from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from . import models, serializers

# Create your views here.




@api_view(['POST'])
def song(request):
    song_ser = serializers.SongSerializer(data=request.data)
    if song_ser.is_valid():
        song_ser.save()
        return Response({"message":"success"})
    else:
        return Response({"message":"error", "data": song_ser.errors})


@api_view(["GET"])
def songs(request):
    qs = models.Song.objects.all()
    ser = serializers.SongSerializer(qs, many=True)
    return Response(ser.data)

@api_view(["GET"])
def user(request):
    user = request.user
    user_ser = serializers.UserSerializer(user)
    return Response(user_ser.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def delete(request, id):
    song = models.Song.objects.get(id=id)
    song.delete()
    return Response({"message": "success"})
