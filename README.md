# End to end demo


## Running
Start with: `docker-compose up -d`

destroy with: `docker-compose down`

## Endpoints
- `/` Publishes whatewer is found in the `www` folder
- `/ows/` Exposes the OGC services of QGIS server
- `/wfs3/` Exposes the OGCAPIF (not completely working)

## Demo
The included demo project can be found at `https://localhost/ows/bees` it exposes WMS, WMTS and WFS.

## Publishing new projects
To publish a project, add it to the .qgs file (not .qgz) `/data/projects/` folder. The project will automatically be available at `https://localhost/ows/projectname` 