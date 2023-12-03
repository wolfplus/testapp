#!/bin/bash

echo Launch Build MB APP :
echo $1

# config variables styles
rm -rf src/theme/variables.scss
cp to_deploy/$1/theme/variables.scss src/theme/variables.scss
# config environnement
rm -rf src/environments/environment.ts
cp to_deploy/$1/environment.ts src/environments/environment.ts
# config link in account
rm -rf src/assets/account-link.json
cp to_deploy/$1/assets/account-link.json src/assets/account-link.json

rm -rf src/assets/app-menu.json
cp to_deploy/$1/assets/app-menu.json src/assets/app-menu.json

# capacitor app
rm -rf ./capacitor.config.ts
cp to_deploy/$1/capacitor.config.ts ./capacitor.config.ts

#move illustration inside dir
rm -rf src/assets/images/illustrations_*
mkdir src/assets/images/illustrations_$1
cp -rf to_deploy/$1/illustrations_$1/ src/assets/images/illustrations_$1/

#copy logo and header picture to assets
rm -rf src/assets/mb
mkdir src/assets/mb
cp -rf to_deploy/$1/assets/mb/ src/assets/mb/

# change ressources icon and splash
cp to_deploy/$1/ressources/splash.png ressources/
cp to_deploy/$1/ressources/icon.png ressources/
#echo Generate new icons - splashscreen

#ionic cordova resources
# npm run resources

echo Start Build project
rm -rf www ios android
#npm run build --prod
ionic build

echo Start Build IOS Folder
#npx cap add ios
#npx cap sync ios
#npm run resources-ios
echo Completed Build - Start Open in XCode

echo Start Build ANDROID Folder
npx cap add android
#npx cap copy android
npx cap sync android
# npm run resources-android
echo Completed Build - Start Open Android Project
# Generate icon app ios & android

rm -rf ./android/app/src/main/res/drawable*
rm -rf ./android/app/src/main/res/mipmap*


#npm run resources

cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy

#npx cap open ios
npx cap open android

# cd ios/App/
# pod install --repo-update
# cd ../..

rm android/app/src/main/res/values/styles.xml
cp ./styles.xml android/app/src/main/res/values/styles.xml
