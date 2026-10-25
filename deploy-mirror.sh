#!/usr/bin/env bash
set -e

echo "=== Building application ==="
npm run build

echo "=== Packaging assets ==="
python3 -c "import zipfile, os
with zipfile.ZipFile('site.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('dist'):
        for f in files:
            path = os.path.join(root, f)
            arcname = os.path.relpath(path, 'dist')
            z.write(path, arcname)
"

echo "=== Deploying to Cloudflare Edge (ship.page) ==="
curl -X POST https://ship.page/deploy -H "Content-Type: application/zip" --data-binary @site.zip

echo ""
echo "=== Deploying to Beacon CDN (beacon.host) ==="
curl -sS https://beacon.host/v1/publish -F archive=@site.zip

echo ""
echo "=== Deployment complete! ==="
