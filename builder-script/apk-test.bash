#!/bin/bash
#rm -rf ./android
#npm run build --prod
#npx cap add android
#npx cap copy android
cd android
./gradlew assembleDebug
cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk ~/Desktop/test-build-apk.apk
