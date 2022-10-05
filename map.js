var map = new L.Map('map', {
    crs: L.CRS.EPSG3857,
    center: [46.801111, 8.226667],
    continuousWorld: true,
    worldCopyJump: false
  });



var lc = L.control.locate({
position: 'topleft',
strings: {
    title: "Show me where I am."
}
}).addTo(map);

var url = 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swisstlm3d-karte-grau/default/current/3857/{z}/{x}/{y}.png';
var tilelayer = new L.tileLayer(url);

var geoadminUrl = 'https://wms.geo.admin.ch/?';
var basemaps = {
'Landeskarten TLM grau': L.tileLayer.wms(geoadminUrl, {
    layers: 'ch.swisstopo.swisstlm3d-karte-grau',
    format: 'image/jpeg',
    detectRetina: true,
    attribution: "Maps by <a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
}),
    
'Landeskarten': L.tileLayer.wms(geoadminUrl, {
    layers: 'ch.swisstopo.pixelkarte-farbe',
    format: 'image/jpeg',
    detectRetina: true,
    attribution: "Maps by <a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
}),
'Landeskarten grau': L.tileLayer.wms(geoadminUrl, {
    layers: 'ch.swisstopo.pixelkarte-grau',
    format: 'image/jpeg',
    detectRetina: true,
    attribution: "Maps by <a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
}),
'Openstreetmap': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}),
'Openstreetmap Topo': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}),
};

// get qgis layers
var options = {'transparent': true, format: 'image/png', info_format: 'text/plain', 'WITH_MAPTIP': 'TRUE'};
var source = L.WMS.source("https://qgis.demo.opengis.ch/ows/bees/", options);
var fieldsLayer = source.getLayer('Fields');
var apiaryLayer = source.getLayer('Apiary');

// setup map
//map.setView([47.366989, 8.545079], 10); // center of switzerland
map.setView([46.8045200, 9.2578700], 16) // Laax for debugging

var defaultBasemap = basemaps["Landeskarten TLM grau"];
map.addLayer(tilelayer);
map.addLayer(fieldsLayer);
map.addLayer(apiaryLayer);

// setup controls
var overlayMaps = {
    'Fields': fieldsLayer,
    'Apiary': apiaryLayer
}

var layerControl = L.control.layers({}, overlayMaps, {collapsed: false}).addTo(map);
var basemapControl = L.control.layers(basemaps, {}, {position: 'bottomright'}).addTo(map);