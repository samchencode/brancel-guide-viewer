require('dotenv').config();

module.exports = {
  expo: {
    name: 'brancel-guide-viewer',
    slug: 'brancel-guide-viewer',
    version: '2.0.0',
    orientation: 'default',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      splash: {
        xib: './assets/splash.ios.xib',
        image: './assets/splash.png',
      },
      bundleIdentifier: 'com.samuel88835.brancel-guide-viewer',
    },
    android: {
      permissions: [],
      package: 'com.samuel88835.brancel_guide_viewer',
      versionCode: 6,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      NODE_ENV: process.env.NODE_ENV,
      WP_API_KEY: process.env.WP_API_KEY,
      WP_API_PAGE_ID: process.env.WP_API_PAGE_ID,
      eas: {
        projectId: 'b578f79f-380a-492a-9a29-75b1c6c79457',
      },
    },
  },
};
