/// <binding />
var path = require('path');
var webpack = require('webpack');
var glob = require('glob-all');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
//var PurifyCSSPlugin = require('purifycss-webpack');

module.exports = {
   entry: {
      main: './src/js/main.js'
   },
   output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'www')
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
               presets: ['es2015']
            }
         },
         {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
               loaders: {
                  js: 'babel-loader?presets[]=es2015',
                  scss: 'vue-style-loader!css-loader!sass-loader',
                  sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
               }
            }
         },
         {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
               fallback: 'style-loader',
               use: [
                  { loader: 'css-loader', options: { minimize: true } },
                  'resolve-url-loader',
                  'sass-loader'
               ]
            })
         },
         {
            test: /\.html$/,
            use: ['html-loader']
         },
         {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'file-loader',
            options: {
               name: '[name].[ext]',
               outputPath: 'img/',
               publicPath: 'file:///android_asset/www/'
            }
         },
         {
            test: /\.(woff2?|ttf|eot|svg)$/,
            loader: 'file-loader',
            options: {
               name: '[name].[ext]',
               outputPath: 'fonts/',
               publicPath: 'file:///android_asset/www/'
            }
         }
      ]
   },
   plugins: [
      new webpack.ProvidePlugin({
         lodash: 'lodash',
         _: 'lodash',
         axios: 'axios'
      }),
      new ExtractTextPlugin({
         filename: './css/style.css'
      }),
      //new PurifyCSSPlugin({
      //   paths: glob.sync([
      //      path.join(__dirname, 'src/*.html'),
      //      path.join(__dirname, 'src/js/*.vue')
      //   ])
      //}),
      new HtmlWebpackPlugin({
         template: 'src/index.html',
         minify: {
            removeComments: true,
            collapseWhitespace: true
         }
      }),
      new webpack.optimize.UglifyJsPlugin({ minimize: true }),
      new CleanWebpackPlugin(['.tmp', 'www/*']),
      new WebpackNotifierPlugin()
   ],
   resolve: {
      alias: {
         'vue': 'vue/dist/vue.js'
      }
   }
};