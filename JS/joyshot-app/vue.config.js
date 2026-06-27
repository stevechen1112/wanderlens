module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  publicPath: '/',
  pluginOptions: {
    i18n: {
      locale: "zh",
      fallbackLocale: "zh",
      localeDir: "locales",
      enableInSFC: false
    }
  },
  devServer: {
    allowedHosts:['https://maps.googleapis.com'],
    // host: 'localhost',
    port: 9666,
    open: process.platform === 'darwin',
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7272/'
      },
      '/place-api': {
        target: 'http://localhost:3000/',
        pathRewrite: { '^/place-api': '' }
      }
    }
   },
   productionSourceMap: true
}

