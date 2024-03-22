#!/bin/bash

srcPath=~/dev/gg-viewer-bky/public
destPath=~/dev/demo.qfield.cloud

cp $srcPath/index.html $destPath/index_orig.html

rm "$destPath"/assets/*
rm -r "$destPath"/components/*
rm -r "${destPath:?}"/lib/*

cp -r "$srcPath"/assets/* "$destPath"/assets/
cp -r "$srcPath"/components/* "$destPath"/components/
cp -r "$srcPath"/lib/* "$destPath"/lib/