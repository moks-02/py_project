from django.db import models
class Toilet(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    lat = models.FloatField()
    lng = models.FloatField()
    description = models.CharField(max_length=300)
    wheelchairAccessible = models.BooleanField()
    changingTable = models.BooleanField()
    freetoUse = models.BooleanField()
    openNow = models.BooleanField()
    accessibility = models.CharField(max_length=20,choices=[('accessible','Accessible'),('not accessible','Not accessible')])
    distance = models.CharField(max_length=20)
    distanceValue = models.FloatField()
    openingHours = models.JSONField()
    
    def __str__(self):
        return self.name
    

# Create your models here.
