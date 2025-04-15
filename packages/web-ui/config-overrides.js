/**
 * See: https://stackoverflow.com/questions/70398678/i-tried-to-polyfill-modules-in-webpack-5-but-not-working-reactjs
 */
module.exports = function override (config) {
  const loaders = config.resolve
  /** 
   * Since upgrade to react-scripts v5 to fix:
   * https://stackoverflow.com/questions/70721056/transparent-iframe-blocks-mouse-event-when-using-react-scripts-start
   * 
   * Need to polyfill what were included by default in v4.
   */
  loaders.fallback = {
      // "fs": false,
      // "tls": false,
      // "net": false,
      // "http": require.resolve("stream-http"),
      // "https": false,
      // "zlib": require.resolve("browserify-zlib") ,
      // "path": require.resolve("path-browserify"),
      // "util": require.resolve("util/"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify")
  }
  
  return config
}
