dir="./to_deploy/"
for FILE in ./to_deploy/*; do
    nameMB=${FILE/#$dir}
    echo "RUN Deploy $nameMB";

    rm -rf www ios android
    rm -rf www ios android

    bash ./builder-script/build-mb-fastlane.bash $nameMB

    cp ./fastlane/ios-config/App.entitlements ./ios/App/App/App.entitlements
    fastlane ios run_actions --env $nameMB
    ruby builder-script/capabilities-mb-install.rb

    npx cap open ios
    echo "IOS S'ouvre si besoin. Pour reprendre, appuyer sur ENTRER"
    read

    fastlane ios release_app --env $nameMB

    fastlane android release_app_android --env $nameMB

    echo "END Deploy $nameMB";

    #NEEDED ONLY ON NEW APP NOT UPDATE TO STORE
    #cp ./android/app/build/outputs/bundle/release/app-release.aab ./sent_mb/$nameMB.aab

done
