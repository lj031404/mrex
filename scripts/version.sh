#!/bin/bash

VERSION=$(cat package.json | jq '.version')
BRANCH=$(echo $branch)

HASH=$(git rev-parse HEAD)

if [ -z $BRANCH ] 
then
	BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

if [ -z $BRANCH ] 
then
	BRANCH=$(git branch --show-current)
fi


JSON=$(echo '{"version":'$VERSION',"branch":"'$BRANCH'","hash":"'$HASH'"}') 

echo $JSON > src/app/git-version.json
echo $JSON saved to src/app/git-version.json
