from rest_framework import serializers
from django.contrib.auth import get_user_model
from . import models

User = get_user_model()


# {
#     "id": 1,
#     "password": "pbkdf2_s4rdNU26Gev376UOTOntAMZtsaSOsjW4iundn2I7ccAY=",
#     "last_login": null,
#     "is_superuser": true,
#     "username": "mioqwe",
#     "first_name": "",
#     "last_name": "",
#     "email": "storozhyk.y@gmail.com",
#     "is_staff": true,
#     "is_active": true,
#     "date_joined": "2024-10-10T14:45:13.451928Z",
#     "groups": [],
#     "user_permissions": []
# }

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Song
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'username', 'email']
