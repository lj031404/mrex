cd ../
SENTRY_SKIP_AUTO_RELEASE=true

HASH=$(git rev-parse HEAD)
VERSION=$(cat package.json | jq .version)
RELEASE="$branch-$VERSION"
RELEASE=$(echo "$RELEASE" | tr -d '"')

echo "Tagging the app $RELEASE"
echo "Hash: $HASH"

sentry-cli releases new "$RELEASE"
sentry-cli releases files "$RELEASE" upload-sourcemaps --url-prefix="~/android_asset/www/" ./dist --rewrite
sentry-cli releases finalize "$RELEASE"
