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
    'GeoExt.Action' 
]);

var mapPanel, tree;

Ext.application({
    name: 'Tree',
    launch: function() {
   
       var map = new OpenLayers.Map('map');
       // destroy the options-toolbar for theme
        var options_toolbar = Ext.getCmp('options-toolbar');
        if(options_toolbar) options_toolbar.destroy();
      
        ///////////
        // Tools //
        ///////////

        var action, actions = {};
        var toolbarItems = [];
        // Navigation control and DrawFeature controls
        // in the same toggle group
        action = Ext.create('GeoExt.Action', {
            text: "Πλοήγηση",
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
        
        action = Ext.create('GeoExt.Action', {
            text: "Πληροφορίες",
            control: gfiControl,
            map: map,
            // button options
            toggleGroup: "draw",
            allowDepress: false,
            pressed: false,
            tooltip: "Πληροφορίες",
            // check item options
            group: "draw",
            checked: false
        });

       
        actions["Πληροφορίες"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        toolbarItems.push("-");
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
                
                new OpenLayers.Layer.WMS("Ρυμοτομία Χανίων",
                    'http://localhost:8080/geoserver/wms', {
                     layers: "rymotomia",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),
                 
                new OpenLayers.Layer.WMS("oikismoi test",
                    'http://localhost:8080/geoserver/wms', {
                     layers: "oikismoi_2000_crete",
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
                        text: "Base Maps"
                    }, {
                        plugins: ['gx_overlaylayercontainer'],
                        expanded: true
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

        Ext.create('Ext.Viewport', {
            layout: "fit",
            hideBorders: true,
            items: {
                layout: "border",
                deferredRender: false,
                items: [mapPanel, tree, {
                    contentEl: "desc",
                    region: "east",
                    bodyStyle: {"padding": "5px"},
                    collapsible: true,
                    collapseMode: "mini",
                    split: true,
                    width: 200,
                    title: "Περιγραφή"
                }]
            }
        });
    }
});
