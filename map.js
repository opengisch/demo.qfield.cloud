var layerConfig = [
    {
        source: 'https://qgis.demo.opengis.ch/ows/bees/',
        layers: ['Fields', 'Apiary']
    },
]
var defaultBasemap = "Swisstopo TLM gray";


// END of config

var map = new L.Map('map', {
    crs: L.CRS.EPSG3857,
    center: [46.801111, 8.226667],
    continuousWorld: true,
    worldCopyJump: false
  });


var lc = L.control.locate({
position: 'topleft',
strings: {
    title: "Locate me"
}
}).addTo(map);


var basemaps = {
'Swisstopo TLM gray': L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swisstlm3d-karte-grau/default/current/3857/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: "Maps by <a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
}),
'Swisstopo': L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', {
    layers: 'ch.swisstopo.pixelkarte-farbe',
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

var overlayMaps = {}

layerConfig.forEach(source => {
    let layerSource = L.WMS.source(source['source'], options);
    console.log(source['source'])
    console.log(source['layers'])
    source['layers'].forEach(function (layerName, index) {
        console.log(`${layerName}`)
        layer = layerSource.getLayer(layerName);
        map.addLayer(layer);
        overlayMaps[layerName] = layer
    })
  })


// setup map
//map.setView([47.366989, 8.545079], 10); // center of switzerland
map.setView([46.8045200, 9.2578700], 16) // Laax for debugging

defaultBasemap = basemaps[defaultBasemap];
map.addLayer(defaultBasemap);

// setup controls
var layerControl = L.control.layers({}, overlayMaps, {collapsed: false}).addTo(map);
var basemapControl = L.control.layers(basemaps, {}, {position: 'bottomright'}).addTo(map);