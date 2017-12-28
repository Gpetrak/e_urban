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

class ArxaiologikoiXwroi(models.Model):
    gid = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50, blank=True)
    fek = models.CharField(max_length=20, blank=True)
    type = models.CharField(max_length=50, blank=True)
    shape_leng = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    zwnh = models.CharField(max_length=50, blank=True)
    fek_2 = models.CharField(max_length=50, blank=True)
    fek_3 = models.CharField(max_length=50, blank=True)
    shape_le_1 = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    shape_area = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    foreas = models.CharField(max_length=50, blank=True)
    geom = models.MultiPolygonField(srid=2100, blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'arxaiologikoi_xwroi'

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name or u''

class Anadas2015(models.Model):
    gid = models.IntegerField(primary_key=True)
    objectid = models.FloatField(blank=True, null=True)
    layer = models.CharField(max_length=4, blank=True)
    name = models.CharField(max_length=80, blank=True)
    area_m2 = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    apofasi = models.CharField(max_length=21, blank=True)
    fek_d = models.CharField(max_length=13, blank=True)
    reason = models.CharField(max_length=39, blank=True)
    year = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    geom = models.MultiPolygonField(srid=2100, blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'anadas_2015'

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name or u''

class Anadasmoi(models.Model):
    gid = models.IntegerField(primary_key=True)
    id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=50, blank=True)
    anadasmos = models.CharField(max_length=50, blank=True)
    shape_leng = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    shape_area = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    foreas = models.CharField(max_length=50, blank=True)
    geom = models.MultiPolygonField(srid=2100, blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'anadasmoi'

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name or u''

class PraxeisXar2015(models.Model):
    gid = models.IntegerField(primary_key=True)
    id = models.FloatField(blank=True, null=True)
    praxi = models.CharField(max_length=14, blank=True)
    antiriseis = models.CharField(max_length=6, blank=True)
    telesidiki = models.CharField(max_length=6, blank=True)
    year = models.FloatField(blank=True, null=True)
    xaraktiras = models.CharField(max_length=26, blank=True)
    morfi = models.CharField(max_length=25, blank=True)
    epitropi = models.CharField(max_length=62, blank=True)
    geom = models.MultiPolygonField(srid=2100, blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'praxeis_xar_2015'

    def __str__(self):
        return self.praxi

    def __unicode__(self):
        return self.praxi or u''

class SxooapKrousona(models.Model):
    gid = models.IntegerField(primary_key=True)
    gid_decimal = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    typos = models.CharField(max_length=255, blank=True)
    geom = models.MultiPolygonField(srid=2100, blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'sxooap_krousona'

    def __str__(self):
        return self.typos

    def __unicode__(self):
        return self.typos or u''
