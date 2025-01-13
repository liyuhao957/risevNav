const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_BUILD_TIME': JSON.stringify(new Date().toISOString())
      })
    ]
  }
}) 