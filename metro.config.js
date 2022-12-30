const { getDefaultConfig } = require('@expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('ejs');

// ignore missing module error from ejs
config.resolver.extraNodeModules['fs'] = config.resolver.emptyModulePath;
config.resolver.extraNodeModules['path'] = config.resolver.emptyModulePath;

// preserve argument names for dependnecy injection
config.transformer.minifierConfig.mangle = false;

module.exports = config;
