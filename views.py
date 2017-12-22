from django.shortcuts import render_to_response
from django.template import RequestContext
from crete_gis.e_urban.models import Oikismoi
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
        location = request.GET.get('lonlat')
        results = []

        # in_out = Oikismoi.objects.using('datastore').filter(geom__contains=location)       
        in_out = 'hello world'
        if in_out:
            results.append(in_out)
        else:
            results.append('out')

        results.append(location)

        return render_to_response('e_urban/ajax_response.html',
                      {
                      'results': results
                      }) 
