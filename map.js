// Define some constant configuration
const LAYER_CONFIG = [
  {
    source: "https://qgis.demo.opengis.ch/ows/bees/",
    layers: ["Fields", "Apiary"],
  },
  {
    source: 'https://qgis.demo.opengis.ch/ows/wastewater/',
    layers: ['Reaches', 'Waterwaste structures']
  },
];
const BASEMAPS = {
  "Swisstopo TLM gray": L.tileLayer(
    "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swisstlm3d-karte-grau/default/current/3857/{z}/{x}/{y}.png",
    {
      detectRetina: true,
      attribution:
        "Maps by <a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>",
    }
  ),
  Swisstopo: L.tileLayer(
    "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg",
    {
      layers: "ch.swisstopo.pixelkarte-farbe",
      detectRetina: true,
      attribution:
        "Maps by <a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>",
    }
  ),
  Openstreetmap: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }),
  "Openstreetmap Topo": L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 17,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  ),
};
const DEFAULT_BASEMAP = "Swisstopo TLM gray";

// initialize Leaflet.js
const map = new L.Map("map", {
  crs: L.CRS.EPSG3857,
  center: [46.801111, 8.226667],
  continuousWorld: true,
  worldCopyJump: false,
});

const locLaax =  {
  lat: 46.80852,
  lng: 9.25787,
  zoom: 16
};

const locArbon =  {
  lat: 47.51467,
  lng: 9.42933,
  zoom: 15
};

// setup map
//map.setView([47.366989, 8.545079], 10); // center of switzerland
map.setView([locLaax.lat, locLaax.lng], locLaax.zoom); // Laax for debugging
map.addLayer(BASEMAPS[DEFAULT_BASEMAP]);

// custom WMS Class to display only the html map tip --> https://github.com/heigeo/leaflet.wms#identify-getfeatureinfo
var CustomWMSSource = L.WMS.Source.extend({
    'showFeatureInfo': function (latlng, info) {

        var layers = info.split('\n\n');
        var new_info = '';
        for (const layer of layers) {
            console.log(layer);
            if (layer.includes("maptip = '")) {
                var layer_info = layer.split('\n')[0].replace("Layer '", '<i>Layer <b>').replace("'", '</b></i>');
                var html_map_tip = layer.split("maptip = '")[1].replace("'", '');
                if (new_info !== '') {
                    new_info += '<hr>';
                }
                new_info += layer_info;
                new_info += html_map_tip;
            }
        }
        if (new_info !== '') {
            this._map.openPopup(new_info, latlng);
        }
    }
});

const overlayMaps = {};
for (const layerConfig of LAYER_CONFIG) {
    const layerSource = new CustomWMSSource(layerConfig["source"], {
        transparent: true,
        format: "image/png",
        info_format: "text/plain",
        WITH_MAPTIP: "TRUE",
    });

    for (const layerName of layerConfig.layers) {
        layer = layerSource.getLayer(layerName);
        map.addLayer(layer);
        overlayMaps[layerName] = layer;
    }
}

// setup controls
const locateControl = L.control
  .locate({
    position: "topleft",
    strings: {
      title: "Locate me",
    },
  })
  .addTo(map);
const layerControl = L.control
  .layers({}, overlayMaps, { collapsed: false })
  .addTo(map);
const basemapControl = L.control
  .layers(BASEMAPS, {}, { position: "bottomright" })
  .addTo(map);



// make a bar with the buttons to navigate between laax and arbon
var zoomBar = L.easyBar([
  L.easyButton( '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Laax_wappen.svg/180px-Laax_wappen.svg.png" width="18px" style="padding-top: 3px;"/>',
      function(control, map){
            map.setView([locLaax.lat, locLaax.lng], locLaax.zoom);
      }
  ),
  L.easyButton( '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Arbon_Wappen.jpg/180px-Arbon_Wappen.jpg" width="18px" style="padding-top: 4px;"/>',
      function(control, map){
        map.setView([locArbon.lat, locArbon.lng], locArbon.zoom);
      }
  ),
]);

// add it to the map
zoomBar.addTo(map);