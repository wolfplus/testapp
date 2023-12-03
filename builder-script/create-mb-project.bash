#!/bin/bash

echo -- START CREATE NEW MB CONFIG --

echo Nom de la marque blanche ex: La maison du squash:
read mb_completed_name
echo Ref de la marque blanche ex: maisondusquash:
read mb_name
cp ./config-app/environments/environment.ts.mb.dist ./config-app/environments/environment.ts.$mb_name.dist
cp ./config-app/theme/variables.scss.mb.dist ./config-app/theme/variables.scss.$mb_name.dist
gsed -i "s/normalClubName/$mb_completed_name/g" ./config-app/environments/environment.ts.$mb_name.dist

echo OneSignal APP ID:
read onesignalapikey
gsed -i "s/onesignalapikey/$onesignalapikey/g" ./config-app/environments/environment.ts.$mb_name.dist
echo OneSignal Ggl:
read oneSignalGgl
gsed -i "s/oneSignalGgl/$oneSignalGgl/g" ./config-app/environments/environment.ts.$mb_name.dist
echo Langue par défaut:
read defaultLang
gsed -i "s/defaultLang/$defaultLang/g" ./config-app/environments/environment.ts.$mb_name.dist
echo Solution paiement, entre quote et séparé de virgule:
read paymentsProvider
gsed -i "s/paymentsProvider/$paymentsProvider/g" ./config-app/environments/environment.ts.$mb_name.dist
echo Nombre de complexe sur la marque blanche:
read countClub
gsed -i "s/countClub/$countClub/g" ./config-app/environments/environment.ts.$mb_name.dist
echo ID des clubs de la marque blanche, entre quote et séparé de virgule:
read clubIds
gsed -i "s/clubIds/$clubIds/g" ./config-app/environments/environment.ts.$mb_name.dist

echo Couleur primaire en HEXA:
read primaryHexa
gsed -i "s/primaryHexa/$primaryHexa/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur primaire en RGB:
read primaryRGB
gsed -i "s/primaryRGB/$primaryRGB/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur secondaire en HEXA:
read secondaryHexa
gsed -i "s/secondaryHexa/$secondaryHexa/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur secondaire en RGB:
read secondaryRGB
gsed -i "s/secondaryRGB/$secondaryRGB/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur tertiaire en HEXA:
read tertiaryHexa
gsed -i "s/tertiaryHexa/$tertiaryHexa/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur tertiaire en RGB:
read tertiaryRGB
gsed -i "s/tertiaryRGB/$tertiaryRGB/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist

echo Couleur primaire contrast en HEXA:
read primaryHexaContrast
gsed -i "s/primaryHexaContrast/$primaryHexaContrast/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur primaire contrast en RGB:
read primaryRGBContrast
gsed -i "s/primaryRGBContrast/$primaryRGBContrast/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur secondaire contrast en HEXA:
read secondaryHexaContrast
gsed -i "s/secondaryHexaContrast/$secondaryHexaContrast/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur secondaire contrast en RGB:
read secondaryRGBContrast
gsed -i "s/secondaryRGBContrast/$secondaryRGBContrast/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur tertiaire contrast en HEXA:
read tertiaryHexaContrast
gsed -i "s/tertiaryHexaContrast/$tertiaryHexaContrast/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur tertiaire contrast en RGB:
read tertiaryRGBContrast
gsed -i "s/tertiaryRGBContrast/$tertiaryRGBContrast/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist

echo Couleur primaire tint en HEXA:
read primaryTint
gsed -i "s/primaryTint/$primaryTint/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur secondaire tint en HEXA:
read secondaryTint
gsed -i "s/secondaryTint/$secondaryTint/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur tertiaire tint en HEXA:
read tertiaryTint
gsed -i "s/tertiaryTint/$tertiaryTint/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist

echo Couleur primaire shade en HEXA:
read primaryShade
gsed -i "s/primaryShade/$primaryShade/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur secondaire shade en HEXA:
read secondaryShade
gsed -i "s/secondaryShade/$secondaryShade/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist
echo Couleur tertiaire shade en HEXA:
read tertiaryShade
gsed -i "s/tertiaryShade/$tertiaryShade/g" /Users/zu/doinsport_app/app-v3/config-app/theme/variables.scss.$mb_name.dist

echo -- END CREATE NEW MB CONFIG --
