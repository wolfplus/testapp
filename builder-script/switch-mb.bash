#!/bin/bash

echo Launch Build MB APP :
echo $1

# config variables styles
rm -rf src/theme/variables.scss
cp config-app/$1/theme/variables.scss src/theme/variables.scss
# config environnement
rm -rf src/environments/environment.ts
cp config-app/$1/environment.ts src/environments/environment.ts
# config link in account
rm -rf src/assets/account-link.json
cp config-app/$1/assets/account-link.json src/assets/account-link.json
# config tabbar app
#rm -rf src/assets/app-menu.json
#cp config-app/$1/assets/app-menu.json src/assets/app-menu.json

# config app
rm -rf ./config.xml
cp config-app/$1/config.xml ./config.xml
# capacitor app
rm -rf ./capacitor.config.json
cp config-app/$1/capacitor.config.json ./capacitor.config.json

#move illustration inside dir
rm -rf src/assets/images/illustrations_*
mkdir src/assets/images/illustrations_$1
cp -rf config-app/$1/illustrations_$1/ src/assets/images/illustrations_$1/

#copy logo and header picture to assets
rm -rf src/assets/mb
mkdir src/assets/mb
cp -rf config-app/$1/assets/mb/ src/assets/mb/

# change ressources icon and splash
rm -rf resources/icon.png resources/splash.png
cp config-app/$1/resources/splash.png resources/
cp config-app/$1/resources/icon.png resources/
#echo Generate new icons - splashscreen
