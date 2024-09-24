#!/bin/bash

srcPath=~/Documents/OpenGIS/geogirafe/gg-viewer/dist/app
destPath=~/Documents/OpenGIS/geogirafe/demo.qfield.cloud

cp $srcPath/index.html $destPath/index_orig.html
cp $srcPath/mobile.html $destPath/mobile.html

rm -r "$destPath"/assets/*
rm -r "$destPath"/icons/*
rm -r "$destPath"/styles/*
rm -r "${destPath:?}"/lib/*
rm "$destPath"/service-worker.js

cp -r "$srcPath"/assets/* "$destPath"/assets/
cp -r "$srcPath"/icons/* "$destPath"/icons/
cp -r "$srcPath"/styles/* "$destPath"/styles/
cp -r "$srcPath"/lib/* "$destPath"/lib/
cp -r "$srcPath"/service-worker.js "$destPath"/service-worker.js