
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ab67677fd6144b7a947fc5551155d99a',
  appName: 'cthub',
  webDir: 'dist',
  server: {
    url: 'https://ab67677f-d614-4b7a-947f-c5551155d99a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000
    }
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
