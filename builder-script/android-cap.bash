#!/bin/bash
echo Start Build project to ANDROID Folder
rm -rf www android .gradle
npm run build
npx cap add android
#npx cap copy android
npx cap sync android
npm run resources-android
echo Completed Build - Start Open Android Project
npx cap open android
