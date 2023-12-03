dir="./to_deploy/"
for FILE in ./to_deploy/*; do
    nameMB=${FILE/#$dir}
    echo "RUN Deploy $nameMB";

    rm -rf www ios android
    rm -rf www ios android

    bash ./builder-script/build-mb-fastlane.bash $nameMB

    cp ./fastlane/ios-config/App.entitlements ./ios/App/App/App.entitlements

    #fastlane ios run_actions --env $nameMB

    #ruby builder-script/capabilities-mb-install.rb

    #npx cap open ios
    #echo "IOS S'ouvre si besoin. Pour reprendre, appuyer sur ENTRER"
    #read

    #fastlane ios export_app --env $nameMB

    fastlane android release_app_android --env $nameMB


    npx cap open android

    echo "END Deploy $nameMB";
    # rm -rf ./sent_mb/$nameMB
    # mkdir ./sent_mb/$nameMB
    # mkdir ./sent_mb/$nameMB/ios
    # cp ./ios ./sent_mb/$nameMB/ios
done
