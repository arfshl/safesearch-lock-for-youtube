#!/bin/bash

# Build Chromium
mkdir -p dist/chromium
cp chromium/manifest.json background.js LICENSE dist/chromium/
cp -r icons dist/chromium/ 
cd dist/chromium 
zip -rq ../../safesearch-lock-for-youtube-chromium.zip . 
cd ../.. && rm -rf dist

# Build Firefox
mkdir -p dist/firefox
cp firefox/manifest.json background.js LICENSE dist/firefox/
cp -r icons dist/firefox/ 
cd dist/firefox
zip -rq ../../safesearch-lock-for-youtube-firefox.zip . 
cd ../.. && rm -rf dist