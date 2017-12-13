from django.conf.urls import patterns, url
from crete_gis.e_urban.views import urban_home, urban_map


urlpatterns = patterns(
    'crete_gis.e_urban',
    url(r'^$', urban_home, name='urban_home'),
    url(r'^e_urban_map/$', urban_map, name='urban_map')
    )


