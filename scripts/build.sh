#!/bin/bash

# build
npm run build:run:android

# sign
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/mrex.keystore cordova/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk mrex

# generate the signed apk
~/applications/build-tools/29.0.0/zipalign -v 4 cordova/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk mrex-signed.apk

