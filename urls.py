from django.conf.urls import patterns, url
from crete_gis.e_urban.views import urban_home


urlpatterns = patterns(
    'crete_gis.e_urban',
    url(r'^$', urban_home, name='urban_home'),
    )


