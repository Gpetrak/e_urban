from django.contrib.gis.db import models

class Oikismoi(models.Model):
    gid = models.IntegerField(primary_key=True)
    objectid = models.IntegerField(blank=True, null=True)
    onomasia = models.CharField(max_length=50, blank=True)
    dhmos = models.CharField(max_length=50, blank=True)
    fyllo = models.CharField(max_length=50, blank=True)
    hyperlink = models.CharField(max_length=254, blank=True)
    shape_leng = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    shape_le_1 = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    shape_area = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    geom = models.MultiPolygonField(srid=2100, blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'oikismoi'

    def __str__(self):
        return self.onomasia

    def __unicode__(self):
        return self.onomasia or u''

class Natura(models.Model):
    gid = models.IntegerField(primary_key=True)
    objectid = models.FloatField(blank=True, null=True)
    code = models.CharField(max_length=50, blank=True)
    area = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    perimeter = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    hectares = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    sitetype = models.CharField(max_length=6, blank=True)
    periphery = models.CharField(max_length=48, blank=True)
    prefecture = models.CharField(max_length=30, blank=True)
    name_latin = models.CharField(max_length=203, blank=True)
    geom = models.MultiPolygonField(srid=2100, blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'natura'

    def __str__(self):
        return self.name_latin

    def __unicode__(self):
        return self.name_latin or u''
