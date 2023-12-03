import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trenicom.elitesoccer',
  appName: 'Elite Soccer & Padel',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      KeyboardDisplayRequiresUserAction: 'false',
      orientation: 'portrait',
      GOOGLE_MAPS_ANDROID_API_KEY: 'AIzaSyDjiACgznEySOd0x8UvnkaoujYhLfohS68',
      GOOGLE_MAPS_IOS_API_KEY: 'AIzaSyC94V2oDU8CZVbQCZyw4tDq4TXB_VTMztc'
    }
  }
};

export default config;
