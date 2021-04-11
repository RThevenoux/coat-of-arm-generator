const path = require('path');
const { HotModuleReplacementPlugin, ProvidePlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: './dist',
    // hot: true,
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.json']
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      showErrors: true,
      cache: true,
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new ProvidePlugin({
      Vue: ['vue/dist/vue.esm.js', 'default'],
    })
  ],
};
