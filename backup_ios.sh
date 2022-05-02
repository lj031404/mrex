#!/bin/bash

mkdir cordova/backup
date=$(date '+%Y-%m-%d')
tar -zcvf "ios_$date.tar.gz" cordova/platforms/ios
mv "ios_$date.tar.gz" cordova/backup/
