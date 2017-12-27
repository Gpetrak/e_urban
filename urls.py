from django.conf.urls import patterns, url
from crete_gis.e_urban.views import urban_home, urban_map, create_get


urlpatterns = patterns(
    'crete_gis.e_urban',
    url(r'^$', urban_home, name='urban_home'),
    url(r'^e_urban_map/$', urban_map, name='urban_map'),
    url(r'^ajax/results/', create_get, name='create_get'),
    # url(r'^static/pdf/(?P<filename>)/$', pdf_home, name='pdf_home')
    )


