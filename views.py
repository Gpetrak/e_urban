# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.gis.geos import Point
from crete_gis.e_urban.models import *
from django.db.models.loading import get_model
from crete_gis.settings import SITEURL, LOCAL_ROOT
import json
import os

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
        
        layer_list = ['oikismoi', 
                      'natura', 
                      'arxaiologikoi_xwroi',
                      'praxeis_xar_2015',
                      'anadas_2015',
                      'anadasmoi',
                      'sxooap_krousona',]
        
        # translate the layers in Greek language
        layer_trans = {'oikismoi': 'Οικισμοί Ν. Χανίων', 
                       'natura': 'Natura 2000',
                       'arxaiologikoi_xwroi': 'Αρχαιολογικοί Χώροι Ν Χανίων',
                       'praxeis_xar_2015': 'Πράξεις Χ/σμού Ν. Ηρακλείου',
                       'anadas_2015': 'Αναδασμοί Ν. Ηρακλείου',
                       'anadasmoi': 'Αναδασμοί Ν. Χανίων',
                       'sxooap_krousona': 'ΣΧΟΟΑΠ Κρουσώνα'
                     }

        # A list to store the resulted messages
        results = []
 
        # check if the list of regions is empty and send a message to the client
        def inform_user(data, regions, model): 
            # A list to store the results of a layer
            result = []
            layer_info = layer_trans[data]
            doc_file = "--"
            img_file = "--"
            if not regions:
                # Build the variables that will be sent into HTML table
                # Every variable is a column
                answer = "Εκτός"
                region = "--"
                # database order_by query
                nearest_region = model.objects.using('datastore').distance(location).order_by('distance').first()
            #    nearest_region_obj = geometry=model.objects.using('datastore').get(name_latin=nearest_region)
            #   dist = location.distance(rearest_region_obj.geom)
                result.extend([layer_info, answer, region, nearest_region, doc_file, img_file])
            else:
                if data == "oikismoi":
                    pdf_img_file = info_engine(regions, model)
                    doc_file = pdf_img_file[0]
                    img_file = pdf_img_file[1]
                answer = "Εντός"
                region = regions[0]
                nearest_region = "--"
                result.extend([layer_info, answer, region, nearest_region, doc_file, img_file])
            return result
        
        # query the database and call inform_user in order to return the messages
        def layer(layer_name, model):
            in_out = model.objects.using('datastore').filter(geom__contains=location)
            info = inform_user(layer_name, in_out, model)
            return info

        # Convert database table names like 'hello_world' with model names like HelloWorld
        # This is a convention of django when generates models automaticaly. 
        def table_to_model(table_name):
            table_name = table_name.split('_')
            result = ""
            for i in table_name: 
            # reconstruct the string
                result += i[0].upper() + i[1:]
            return result
        
         
        def info_engine(region, model):
            link_info = []
            # retrieve the objectid of a settlement
            t = model.objects.using('datastore').only('objectid').get(onomasia=region[0]).objectid
            t_str = str(t)
  
            for dirpath, subdirs, files in os.walk(LOCAL_ROOT + '/e_urban/static/pdf/'):
                for i in files:
                    if i.endswith("_" + t_str + ".pdf"):
                        information = i
                        # build the file's link
                        link_info.append("<a href='" + SITEURL + "static/pdf/" + information + "' target='_blank'>Έγγραφο pdf</a>")
                        break
                
            if len(link_info) == 0:
                link_info.append("--")
            #    link_info[0] = "Δεν υπάρχει καταχωρημένο έγγραφο γι'αυτή την οντότητα"

            for dirpath, subdirs, files in os.walk(LOCAL_ROOT + '/e_urban/static/img/tif_files/'):
                for i in files:
                    if i.endswith("_" + t_str + ".tif"):
                        information = i
                        # build the file's link
                        link_info.append("<a href='" + SITEURL + "static/img/tif_files/" + information + "' target='_blank'>Χάρτης</a>")
                        break
            
            if len(link_info) == 1:
                link_info.append("--")
            #    link_info[1] = "Δεν υπάρχει καταχωρημένο έγγραφο γι'αυτή την οντότητα"
            return link_info

        for i in layer_list:
            # because if table_name = layer_name, model_name = LayerName
            model_name_str = table_to_model(i)
            # a method to return the interested model
            model_name = get_model('e_urban', model_name_str)
            # store into results list the messages that layer function returns
            results.append(layer(i, model_name)) 
           
                 

        # Render the template
        return render_to_response(
                             'e_urban/ajax_response.html',
                             {
                            'results': results,
                             }) 
