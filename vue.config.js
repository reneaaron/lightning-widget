const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = defineConfig({
  filenameHashing: false,
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      //new BundleAnalyzerPlugin(), 
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    ]
  },
  chainWebpack:
    config => {
      config.optimization.delete('splitChunks')
    }
})
