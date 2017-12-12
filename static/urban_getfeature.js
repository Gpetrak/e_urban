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
    'GeoExt.window.Popup' 
]);

var mapPanel, tree;

Ext.application({
    name: 'Tree',
    launch: function() {
      //  var wrap = Ext.get('wrap');
      //  if(wrap) wrap.destroy();

        // create a map panel with some layers that we will show in our layer tree
        // below.
        mapPanel = Ext.create('GeoExt.panel.Map', {
            border: true,
            region: "center",
            // we do not want all overlays, to try the OverlayLayerContainer
            map: {allOverlays: false},
            center: new OpenLayers.LonLat(24, 39).transform(
            'EPSG:4326', 'EPSG:900913'),
            zoom: 7,
            layers: [
                                
                /* Base Layers */
                new OpenLayers.Layer.OSM("OpenStreetMap" ),
                
                new OpenLayers.Layer.WMS("Αιγιαλοί",
                    'http://localhost:8080/geoserver/wms', {
                     layers: "aigialoi",
                     transparent: true,
                     format: "image/png"
                     }, {
                     isBaseLayer: false,
                     visibility: false,
                     projection: new OpenLayers.Projection("EPSG:900913"),
                     buffer: 0
                     }
                  ),
                             
                 new OpenLayers.Layer.WMS("Αγροκτήματα",
                    'http://localhost:8080/geoserver/wms', {
                     layers: "agroktimata",
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
    
        var gfiControl = new OpenLayers.Control.WMSGetFeatureInfo({
                 autoActivate: true,
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
                       width: 300,
                       height: 250,
                       layout: "accordion",
                       map: mapPanel,
                       locaiton: e.xy,
                       items: items
                      }).show();
                     }
                   }
                 }
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
        
        mapPanel.map.addControl(gfiControl);
        var layer;

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

        Ext.create('Ext.panel.Panel', {
            layout: "fit",
            renderTo: "view",
            width:1100,
            height: 600,
            items: {
                layout: "border",
                deferredRender: false,
                items: [mapPanel, tree, 
                ]
            }
        });
    }
});
