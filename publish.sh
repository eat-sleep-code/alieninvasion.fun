commitMessage="$1"
release="$2"
version=$(date +'v%Y.%m.%d.%H%M%S')


echo -e '\033[0;32m Getting latest from "develop" branch...\e[0m'
git pull origin develop


echo -e '\033[0;32m Installing NPM packages...\e[0m'
npm install --verbose


echo -e '\033[0;32m Running NPM scripts...\e[0m'
npm run scss
npm run concat


#echo -e '\033[0;32m Copying audio...\e[0m'
#rm -Rf dist/audio
#mkdir -p dist/audio
#cp -r src/audio/*.* dist/audio/


#echo -e '\033[0;32m Copying images...\e[0m'
#rm -Rf dist/images
#mkdir -p dist/images
#cp -r src/images/*.* dist/images/


#echo -e '\033[0;32m Copying main file...\e[0m'
#rm -f dist/index.html
#cp -r src/index.html dist/


# If enabling add ?v={{version}} to any URLs you want to bust
#echo -e '\033[0;32m Adding cache-busting tag...\e[0m'
#grep -rl '{{version}}' ./public/*.html | xargs sed -i "s/{{version}}/$(date '+%Y%m%d%H%M%S')/g"


echo -e '\033[0;32m Committing changes to "develop" branch...\e[0m'
git add . -A
git commit -m "$version: $commitMessage"
git push -u origin develop

# If a release...
if [ "$release" == "release" ]; then
    echo -e '\033[0;32m Pushing release to "master/main" branch and deploying...\e[0m'
    git push origin develop:master --force
    git tag -a "$version" -m "$version: $commitMessage"
    git push -u origin "$version"
    # firebase login --reauth
    firebase deploy
fi
