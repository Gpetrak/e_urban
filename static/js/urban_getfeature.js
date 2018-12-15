Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'GeoExt.tree.Panel',
    'Ext.tree.plugin.TreeViewDragDrop',
    'GeoExt.panel.Map',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
    'GeoExt.data.LayerTreeModel',
    'GeoExt.tree.View',
    'GeoExt.tree.Column',
    'Ext.layout.container.Accordion',
    'Ext.grid.property.Grid',
    'GeoExt.window.Popup',
    'GeoExt.Action',
    'Ext.Action',
    'Ext.panel.Panel' 
]);

var mapPanel, tree;

Ext.application({
    name: 'Tree',
    launch: function() {
   
       var map = new OpenLayers.Map('map');
       // destroy the options-toolbar for theme
       var options_toolbar = Ext.getCmp('options-toolbar');
       if(options_toolbar) options_toolbar.destroy();

       /////////////////////////////////////
       ////functions for handling events////
       /////////////////////////////////////
      
       // function that stores the coordinates as lonlat and sends an ajax request to the server
         function handleMapClick(evt) {
         var toProjection = new OpenLayers.Projection("EPSG:4326");
         var lonlat = map.getLonLatFromViewPortPx(evt.xy).transform(map.getProjectionObject(), toProjection);
         var csrf = Ext.util.Cookies.get('csrftoken');
         Ext.Ajax.request({ 
           url: '/e_urban/ajax/results/',
           method: 'GET',
           params: {
               'latitude' : lonlat.lat,
               'longitude': lonlat.lon,   
               'csrfmiddlewaretoken': csrf
             },
           success: function(response) {
                var text = response.responseText;
                new GeoExt.Popup({
                  title: 'Πολεοδομικές Πληροφορίες',
                  location: evt.xy,
                  width:700,
                  height: 400,
                  map: mapPanel,
                  html: text,
                  maximizable: true,
                  collapsible: true
                  }).show();
           }, 
           failure: function (response) {
              // var text = response.responseText;
               Ext.Msg.alert('Failure', 'Please try again...');
               },          
            }); 
        }
 
         // add WMS GetFeatureInfo functionality 
         var gfiControl = new OpenLayers.Control.WMSGetFeatureInfo({
                // autoActivate: true,
                 drillDown: true,
                 infoFormat: "application/vnd.ogc.gml",
                 maxFeatures: 3,
                 eventListeners: {
                    "getfeatureinfo": function(e) {
                     var items = [];
                     Ext.each(e.features, function(feature) {
                        items.push({
                           xtype: "propertygrid",
                           title: feature.fid,
                           source: feature.attributes
                      });
                 });
                 if (items.length > 0) {
                    Ext.create('GeoExt.window.Popup', {
                       title: "Feature Info",
                       width: 350,
                       height: 320,
                       layout: "accordion",
                       map: mapPanel,
                       location: e.xy,
                       items: items
                      }).show();
                     }
                   }
                 }
              });
 
        ///////////
        // Tools //
        ///////////

        var action, actions = {};
        var toolbarItems = [];
        // Navigation control and DrawFeature controls
        // in the same toggle group
        action = Ext.create('GeoExt.Action', {
            iconCls:'controls_map_navigation',
            control: new OpenLayers.Control.Navigation(),
            map: map,
            // button options
            toggleGroup: "draw",
            allowDepress: false,
            pressed: true,
            tooltip: "Πλοήγηση",
            // check item options
            group: "draw",
            checked: true
        });
        actions["Πλοήγηση"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));

        toolbarItems.push("-");

         // ZoomIn control
        action = Ext.create('GeoExt.Action', {
            control: new OpenLayers.Control.ZoomIn(),
            map: map,
	    iconCls:'controls_map_zoomin',
	    tooltip: "Μεγέθυνση"
        });
        actions["zoomin"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button',action));

        toolbarItems.push("-");

        // ZoomOut control
        action = Ext.create('GeoExt.Action', {
   	    control: new OpenLayers.Control.ZoomOut(),
	    map: map,
	    iconCls:'controls_map_zoomout',
	    tooltip: "Σμίκρυνση"
        });
        actions["zoomout"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));

        toolbarItems.push("-");

        action = Ext.create('GeoExt.Action', {
            iconCls: 'controls_map_getFeatureInfo',
            control: gfiControl,
            map: map,
            // button options
            toggleGroup: "draw",
            allowDepress: true,
            pressed: false,
            tooltip: "Πληροφορίες",
            // check item options
            group: "draw",
            checked: false
        });

        actions["Feature Info"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        toolbarItems.push("-");

        // Measure distance control
        action = Ext.create('GeoExt.Action', {
	    iconCls:'controls_map_measureline',
	    control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
	        eventListeners: {
	            measure: function(evt) {
                         alert("Distance: " + evt.measure + " " + evt.units);
		    } 
	    } 
        }),
        map: map,
        toggleGroup: "draw",
        allowDepress: false,
        tooltip: "Μέτρηση απόστασης",
        group: "draw"
        });
        actions["measure_distance"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));

        // Measure area control
        action = Ext.create('GeoExt.Action', {
    	    iconCls:'controls_map_measurearea',
	    control: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
	         eventListeners: {
	             measure: function(evt) {
		        alert("Area: " + evt.measure + " square " + evt.units);
		    }
	    }
        }),
        map: map,
        toggleGroup: "draw",
        allowDepress: false,
        tooltip: "Μέτρηση εμβαδού",
        group: "draw"
        });
        actions["measure_distance"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        toolbarItems.push("-");

        ////////////////////
        //////db Tools//////
        ////////////////////

        var action_db, actions_db = {};
        var toolbarItems_db = [];

        action_db = Ext.create('Ext.Action', {
            text: "on",
            handler: function () {
                     map.events.register('click', map, handleMapClick);
                     },
            map: map,
            // button options
            allowDepress: true,
            pressed: false,
            tooltip: "Ενεργοποίηση",
            // check item options
            checked: false
        });
        actions_db["on"] = action_db;
        toolbarItems_db.push(Ext.create('Ext.button.Button', action_db));

        toolbarItems_db.push("-");

        action_db = Ext.create('Ext.Action', {
            text: "off",
            handler: function () {
                     map.events.unregister('click', map, handleMapClick);
                     },
            map: map,
            // button options
            toggleGroup: "draw",
            allowDepress: true,
            pressed: false,
            tooltip: "Απενεργοποίηση",
            // check item options
            group: "draw",
            checked: false
        });
        actions_db["off"] = action_db;
        toolbarItems_db.push(Ext.create('Ext.button.Button', action_db));

        // create a map panel with some layers that we will show in our layer tree
        // below.
        
        mapPanel = Ext.create('GeoExt.panel.Map', {
            border: true,
            region: "center",
            // we do not want all overlays, to try the OverlayLayerContainer
            map: map,
            center: new OpenLayers.LonLat(25.0213, 35.1333).transform(
            'EPSG:4326', 'EPSG:900913'),
            zoom: 8,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: toolbarItems
            }],
            layers: [
                                
                /* Base Layers */
                new OpenLayers.Layer.OSM("OpenStreetMap" ),
                
                new OpenLayers.Layer.WMS("Τμήματα Πολ. Σχεδίων Ν.Χανίων",
                    '/geoserver/wms', {
                     layers: "tmimata_rymotomias_latin7",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),
                 
                new OpenLayers.Layer.WMS("Οικισμοί Ν. Χανίων",
                    '/geoserver/wms', {
                     layers: "oikismoi",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ), 

                new OpenLayers.Layer.WMS("Αρχ/κοί Χώροι Ν. Χανίων",
                    '/geoserver/wms', {
                     layers: "arxaiologikoi_xwroi",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),
 
                new OpenLayers.Layer.WMS("Απαλλοτρίωσεις Ν. Χανίων",
                    '/geoserver/wms', {
                     layers: "apallotriwseis",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),
 
                new OpenLayers.Layer.WMS("Πράξεις Χ/σμού Ν.Ηρακλείου",
                    '/geoserver/wms', {
                     layers: "praxeis_xar_2015",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),

                new OpenLayers.Layer.WMS("ΣΧΟΟΑΠ Κρουσώνα",
                    '/geoserver/wms', {
                     layers: "sxooap_krousona",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),

                new OpenLayers.Layer.WMS("Αναδασμοί Ν. Ηρακλείου",
                    '/geoserver/wms', {
                     layers: "anadas_2015",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),

                new OpenLayers.Layer.WMS("Αναδασμοί Ν.Χανίων",
                    '/geoserver/wms', {
                     layers: "anadasmoi",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),

                new OpenLayers.Layer.WMS("Οικισμοί Ν. Ρεθύμνης",
                    '/geoserver/wms', {
                     layers: "oikismoi1",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),
 
                new OpenLayers.Layer.WMS("Οικ. Τετράγωνα Ν.Χανίων",
                    '/geoserver/wms', {
                     layers: "oikodomika_tetragwna",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),

                new OpenLayers.Layer.WMS("Πόλεις - Χωριά Κρήτης",
                    '/geoserver/wms', {
                     layers: "villages_cities",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),

                             
            ]
        });
    

        var store = Ext.create('Ext.data.TreeStore', {
            model: 'GeoExt.data.LayerTreeModel',
            root: {
                expanded: true,
                children: [
                     {
                        plugins: ['gx_baselayercontainer'],
                        expanded: true,
                        text: "Βασικά Υπόβαθρα"
                    }, {
                        plugins: ['gx_overlaylayercontainer'],
                        expanded: true,
                        text: 'Επιφάνειες'
                    }
                ]
            }
        });
        
        mapPanel.map.addControl(new OpenLayers.Control.MousePosition()); 
        mapPanel.map.addControl(gfiControl);


        // create the tree with the configuration from above
        tree = Ext.create('GeoExt.tree.Panel', {
            border: true,
            region: "west",
            title: "Layers",
            width: 250,
            split: true,
            collapsible: true,
            collapseMode: "mini",
            autoScroll: true,
            store: store,
            rootVisible: false,
            lines: true
        });
 
        var db_tools = Ext.create('Ext.Panel', {
            html: "<h3>Εντός ή Εκτός</h3>" +
                  "<p>Ενεργοποιώντας τα χωρικά ερωτήματα μπορείτε με ένα κλικ στο χάρτη να λάβετε πληροφορίες για χωροταξικά θέματα</p>",
            bodyStyle: {"padding": "5px"},
            border: true,
            region: "north",
            title: "Χωρικά Ερωτήματα",
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: toolbarItems_db
            }],
            split: true,
            //collapsible: true,
            autoScroll: true,
            rootVisible: false,
            lines: true
        });
    
        var info = Ext.create('Ext.Panel', {
            contentEl: "desc",
            bodyStyle: {"padding": "5px"},
            border: true,
            region: "south",
            // title: "Περιγραφή",
           // collapsible: true
        });

        var panel_east = Ext.create('Ext.panel.Panel', {
            title: "e - Urban",
            border: true,
            region: "east",
            width: 200,
            items: [db_tools, info],
            split: true,
            collapsible: true,
            autoScroll: true,
            rootVisible: false,
            lines: true
        });

        Ext.create('Ext.Viewport', {
            layout: "fit",
            hideBorders: true,
            items: {
                layout: "border",
                deferredRender: false,
                items: [mapPanel, tree, panel_east]
            }
        });
    }
});
