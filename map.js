// Define some constant configuration
const LAYER_CONFIG = [
  {
    source: "https://qgis.demo.opengis.ch/ows/bees/",
    layers: ["Fields", "Apiary"],
    with_maptip: true,
    info_format: "text/plain",
    locations: {
      laax_bees: {
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Laax_wappen.svg/180px-Laax_wappen.svg.png',
        lat: 46.80852,
        lng: 9.25787,
        zoom: 16,
        basemap: "Swisstopo",
      },
      berlin_bees: {
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Coat_of_arms_of_Berlin.svg/292px-Coat_of_arms_of_Berlin.svg.png',
        lat: 52.5038,
        lng: 13.2714,
        zoom: 16,
        basemap: "geobasis-bb.de",
      },
    },
  },
  {
    source: "https://qgis.demo.opengis.ch/ows/wastewater/",
    layers: ["Reaches", "Wastewater structures"],
    with_maptip: false,
    info_format: "text/html",
    locations: {
      arbon: {
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Arbon_Wappen.jpg/180px-Arbon_Wappen.jpg',
        lat: 47.51467,
        lng: 9.42933,
        zoom: 15,
        basemap: "Swisstopo TLM gray",
      },
    },
  },
  {
    source: "https://qgis.demo.opengis.ch/ows/qgep_db/",
    layers: ["reaches", "structures"],
    with_maptip: false,
    info_format: "text/html",
    locations: {
      berlin: {
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Coat_of_arms_of_Berlin.svg/292px-Coat_of_arms_of_Berlin.svg.png',
        lat: 52.503,
        lng: 13.270,
        zoom: 18,
        basemap: "geodatenzentrum.de",
      },
    },
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
  "Swisstopo": L.tileLayer(
    "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg",
    {
      layers: "ch.swisstopo.pixelkarte-farbe",
      detectRetina: true,
      attribution:
        "Maps by <a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>",
    }
  ),
  "Openstreetmap": L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }),
  "Openstreetmap Topo": L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  ),
  "geodatenzentrum.de": L.tileLayer.wms(
    "https://sgx.geodatenzentrum.de/wms_basemapde",
    {
      layers: "de_basemapde_web_raster_farbe",
    }
  ),
  "geobasis-bb.de": new L.tileLayer.wms(
    "https://isk.geobasis-bb.de/mapproxy/dop20c_wmts/service",
    {
      layers: "bebb_dop20c"
    }
  ),
};

const DEFAULT_PROJECT = LAYER_CONFIG[2];
const DEFAULT_LOCATION = DEFAULT_PROJECT.locations["berlin"];
const DEFAULT_BASEMAP = "Openstreetmap";


const map = new L.Map("map", {
  crs: L.CRS.EPSG3857,
  center: [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng],
  continuousWorld: true,
  worldCopyJump: false,
});


// setup map
map.setView([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng], DEFAULT_LOCATION.zoom);
map.addLayer(BASEMAPS[DEFAULT_BASEMAP]);

// custom WMS Class to display only the html map tip --> https://github.com/heigeo/leaflet.wms#identify-getfeatureinfo
const CustomWMSSource = L.WMS.Source.extend({
  showFeatureInfo: function (latlng, info) {
    const layersInfo = info.split("\n\n");
    let newInfo = "";
    for (const layerInfo of layersInfo) {
      if (layerInfo.includes("maptip = '")) {
        const layer_info = layerInfo
          .split("\n")[0]
          .replace("Layer '", "<i>Layer <b>")
          .replace("'", "</b></i>");
        const htmlMapTip = layerInfo.split("maptip = '")[1].replace("'", "");
        if (newInfo !== "") {
          newInfo += "<hr>";
        }
        newInfo += layer_info;
        newInfo += htmlMapTip;
      } else {
        newInfo = layerInfo;
      }
    }
    if (newInfo !== "") {
      this._map.openPopup(newInfo, latlng, {
        minWidth: 200,
        maxWidth: window.screen.width * 0.8,
      });
    }
  },
});

const overlayMaps = {};
for (const layerConfig of LAYER_CONFIG) {
  const layerOptions = {
    transparent: true,
    format: "image/png",
    info_format: layerConfig["info_format"],
    WITH_MAPTIP: layerConfig["with_maptip"],
  };
  const layerSource = new CustomWMSSource(layerConfig["source"], layerOptions);

  for (const layerName of layerConfig.layers) {
    layer = layerSource.getLayer(layerName);
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
  .layers({}, {}, { collapsed: false })
  .addTo(map);
const basemapControl = L.control
  .layers(BASEMAPS, {}, { position: "bottomright" })
  .addTo(map);


const setLocation = (config, location, control, map) => {
  map.setView([location.lat, location.lng], location.zoom);

  for (const layer of Object.values(overlayMaps)) {
    map.removeLayer(layer);
    layerControl.removeLayer(layer);
  }

  for (const layerName of config.layers) {
    map.addLayer(overlayMaps[layerName]);
    layerControl.addOverlay(overlayMaps[layerName], layerName);
  }

  // set current basemap
  const basemapName = location.basemap || DEFAULT_BASEMAP;

  for (const basemapLayer of Object.values(BASEMAPS)) {
    map.removeLayer(basemapLayer)
  }
  map.addLayer(BASEMAPS[location.basemap])
};
const projects = [];

for (const config of LAYER_CONFIG) {
  for (let [locationName, location] of Object.entries(config.locations)) {
    locationName = locationName.replace("_", " ");
    locationName = locationName.charAt(0).toUpperCase() + locationName.slice(1).toLowerCase();
    const projectControl = L.easyButton(
      `<img src="${location.iconUrl}" width="18px" style="padding-top: 3px;" title="${locationName}" />`,
      function (control, map) {
        setLocation(config, location, control, map)
      },
    );
    projects.push(projectControl)
  }
}

// make a bar with the buttons to navigate between laax and arbon
const zoomBar = L.easyBar(projects);


// add it to the map
zoomBar.addTo(map);


setLocation(DEFAULT_PROJECT, DEFAULT_LOCATION, layerControl, map);