from django.db import models
from shared.models import BaseModel
import uuid

# Create your models here.
class RoomMember(BaseModel):
    name = models.CharField(max_length=250, verbose_name="User Name")
    uid = models.CharField(max_length=250, verbose_name="UID")
    room = models.CharField(max_length=250 , verbose_name="Room Name")

    def __str__(self):
        return self.name