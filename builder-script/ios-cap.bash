#!/bin/bash

echo Start Build project to IOS Folder
rm -rf www ios
npm run build --prod
npx cap add ios
#npx cap copy ios
npx cap sync ios
npm run resources-ios
echo Completed Build - Start Open in XCode

#echo Remove Xcode Assets icons
#rm -rf ./ios/App/App/Assets.xcassets
#echo Copy Xcode Assets icons
#cp -r ./builder-script/Assets.xcassets ./ios/App/App

npx cap open ios
