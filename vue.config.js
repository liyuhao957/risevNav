const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 生产环境配置
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  
  // 开发环境代理配置
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/monitor/api': {
        target: 'http://localhost:3001',
        pathRewrite: {
          '^/monitor/api': '/api'
        },
        changeOrigin: true
      }
    }
  }
}) 