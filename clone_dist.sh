echo "bash: Removing existing dist...";
rm -rf ../server/builds/website;
echo "bash: Bringing new one...";
cp -r dist ../server/builds/website