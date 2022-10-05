map = new L.Map('map', {
maxZoom: 18,
center: [46.801111, 8.226667],
});

var lc = L.control.locate({
position: 'topright',
strings: {
    title: "Show me where I am."
}
}).addTo(map);


var geoadminUrl = 'https://wms.geo.admin.ch/?';

var basemaps = {
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


var layer = basemaps["Landeskarten"];
map.addLayer(layer);
//map.setView([47.366989, 8.545079], 10); // center of switzerland
map.setView([46.8045200, 9.2578700], 16) // Laax for debugging


var options = {'transparent': true, format: 'image/png', info_format: 'text/plain', 'WITH_MAPTIP': 'TRUE'};
var source = L.WMS.source("https://qgis.demo.opengis.ch/ows/bees/", options);
var layer1 = source.getLayer('Fields');
var layer2 = source.getLayer('Apiary');
overlayMaps = {
'Fields': layer1,
'Apiary': layer2
}
/*
// Possibility to add second menu to select the layers
var control = L.control.layers({}, {
'Fields': layer1,
'Apiary': layer2
})
control.addTo(map);
*/
var layerControl = L.control.layers(basemaps, overlayMaps).addTo(map);
