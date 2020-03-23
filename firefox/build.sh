# Check if _dist folder exists
[ -d '_dist' ] || mkdir '_dist'
rm -rf _dist/*

# Transpile ts
tsc -p tsconfig.json

# Copy all other resources
cp -r css/ _dist/
cp -r icons/ _dist/
cp manifest.json _dist/

# Remove the old zip
#[ -f '_dist/firefox.zip' ] || rm '_dist/firefox.zip'

# Create the zip file
cd _dist || echo 'Could not go into the direcoty'
zip -r firefox.zip *
cd ..
