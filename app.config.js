require('dotenv').config();

module.exports = {
  expo: {
    name: 'brancel-guide-viewer',
    slug: 'brancel-guide-viewer',
    version: '1.0.0',
    orientation: 'portrait',
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
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      NODE_ENV: process.env.NODE_ENV,
      WP_API_KEY: process.env.WP_API_KEY,
      WP_API_PAGE_ID: process.env.WP_API_PAGE_ID,
    },
  },
};
