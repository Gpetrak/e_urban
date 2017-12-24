from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.gis.geos import Point
from crete_gis.e_urban.models import Oikismoi
from crete_gis.e_urban.models import Natura
import json

def urban_home(request):
    return render_to_response('e_urban/e_urban_base.html',
                               RequestContext(request)
                             )

def urban_map(request):
    return render_to_response('e_urban/e_urban_map.html',
                               RequestContext(request)
                             )

def create_get(request):
    if request.method == 'GET':
        latitude = request.GET.get('latitude')
        longitude = request.GET.get('longitude')

        latitude = float(latitude)
        longitude = float(longitude)
      
        location = Point(longitude, latitude, srid=4326)
        results = []
      
        # information about settlement 
        settlement = Oikismoi.objects.using('datastore').filter(geom__contains=location)       
        out = 'out'
        if settlement:
            results.append([settlement[0], "http://localhost:8000"])
        else:
            results.append([out])
        
        # information about natura
        natura = Natura.objects.using('datastore').filter(geom__contains=location)
        if natura:
            results.append([natura[0], "http://localhost:8000"])
        else:
            results.append([out])
        

        # results.extend([latitude, longitude])

        return render_to_response('e_urban/ajax_response.html',
                      {
                      'results': results
                      }) 
