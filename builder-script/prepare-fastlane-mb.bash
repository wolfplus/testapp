#!/bin/bash

echo -- START FASTLANE PREPRARE --
cp -r ./config-app/$full_name_path ./to_deploy/$full_name_path

echo Ref de la marque blanche ex: maisondusquash:
read full_name_path

FILE=./fastlane/backup-env/.env.$full_name_path
if [ -f "$FILE" ]; then
    echo ".env.$FILE exists."
    cp ./fastlane/backup-env/.env.$full_name_path ./fastlane/.env.$full_name_path
else
    echo Nom de la marque blanche ex: La maison du squash:
    read full_name
    echo Mot de passe du Keystore:
    read keystore_pass
    echo Path complet du keystore:
    read keystore_path
    echo Package name app:
    read package_name
    echo Version du build ex: 3.5.5:
    read version_app
    echo Numéro du build ex: 355:
    read numero_build

    cp ./builder-script/.env.dist ./fastlane/.env.$full_name_path

    gsed -i "s/MB_NAME_FULL_PATH/$full_name_path/g" ./fastlane/.env.$full_name_path
    gsed -i "s/MB_NAME_FULL/$full_name/g" ./fastlane/.env.$full_name_path
    gsed -i "s/MB_KEYSTORE_PASS/$keystore_pass/g" ./fastlane/.env.$full_name_path
    gsed -i "s/KEYSTORE_FULL_PATH/$keystore_path/g" ./fastlane/.env.$full_name_path
    gsed -i "s/PACKAGE_NAME/$package_name/g" ./fastlane/.env.$full_name_path
    gsed -i "s/VERSION_APP/$version_app/g" ./fastlane/.env.$full_name_path
    gsed -i "s/NUM_BUILD/$numero_build/g" ./fastlane/.env.$full_name_path

    cp ./fastlane/.env.$full_name_path ./fastlane/backup-env/.env.$full_name_path
fi

echo -- END FASTLANE PREPRARE --
