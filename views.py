from django.shortcuts import render_to_response
from django.template import RequestContext

def urban_home(request):
    return render_to_response('e_urban/e_urban_index.html',
                               RequestContext(request))
