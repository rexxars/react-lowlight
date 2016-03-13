'use strict'

var webpack = require('webpack')

var config = {
  output: {
    library: 'reactLowlight',
    libraryTarget: 'umd'
  },
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}

if (process.env.NODE_ENV !== 'production') {
  config.cache = true
  config.devtool = 'source-map'
}

module.exports = config
