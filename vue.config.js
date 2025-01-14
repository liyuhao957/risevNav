const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_BUILD_TIME': JSON.stringify(new Date().toISOString()),
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false'
      })
    ]
  }
}) 