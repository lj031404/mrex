#!/bin/bash

set -e 

npm run build:prod; 
npm run copy:dist; 
cd cordova; 
cordova build --release android

cd ..

# Create a key once
#keytool -genkey -v -keystore ~/mrex.keystore -alias mrex -keyalg RSA -keysize 2048 -validity 10000

# sign the app
cd cordova/platforms/android/app/build/outputs/apk/release

# delete the old apk if it already exist
test -f app-release-signed.apk && rm app-release-signed.apk

jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/mrex.keystore -storepass "$MREX_KEYSTORE" app-release-unsigned.apk mrex

zipalign -v 4 app-release-unsigned.apk app-release-signed.apk

# install the APK on Android
cd ../../../../../../../../

# Set release info on Sentry
BRANCH=$(git rev-parse --abbrev-ref HEAD)
HASH=$(git rev-parse HEAD)
VERSION=$(cat package.json | jq .version)
RELEASE="$BRANCH-$VERSION"
RELEASE=$(echo "$RELEASE" | tr -d '"')
sentry-cli releases new "$RELEASE"
sentry-cli releases files "$RELEASE" upload-sourcemaps --url-prefix="~/android_asset/www/" ./dist
sentry-cli releases finalize "$RELEASE"

npm run install-apk
