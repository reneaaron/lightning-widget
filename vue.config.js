const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  filenameHashing: false,
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      headers: { "Access-Control-Allow-Origin": "*" }
    },
    plugins: [
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
