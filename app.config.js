const baseConfig = require('./app.json');

module.exports = () => {
  const config = JSON.parse(JSON.stringify(baseConfig.expo));
  const googleMapsApiKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ??
    process.env.GOOGLE_MAPS_API_KEY;

  if (googleMapsApiKey) {
    config.android = {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    };
    config.plugins = (config.plugins ?? []).map((plugin) =>
      plugin === 'react-native-maps'
        ? ['react-native-maps', { androidGoogleMapsApiKey: googleMapsApiKey }]
        : plugin
    );
  } else {
    config.plugins = (config.plugins ?? []).map((plugin) =>
      plugin === 'react-native-maps'
        ? ['react-native-maps', {}]
        : plugin
    );
  }

  return { expo: config };
};
