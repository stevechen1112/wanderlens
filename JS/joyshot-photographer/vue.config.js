module.exports = {
  runtimeCompiler: true,
  publicPath: '/',
  devServer: {
    // host: 'localhost',
    port: 9777,
    open: process.platform === 'darwin',
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
          target: 'http://localhost:7272/'
        }
      }
    },
    productionSourceMap: true
}
