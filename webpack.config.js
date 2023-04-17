// Generated using webpack-cli https://github.com/webpack/webpack-cli
const webpack = require('webpack'); 
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = "style-loader";
require('dotenv').config({ path: './.env' }); 
const Dotenv = require('dotenv-webpack');
const config = {
  mode: 'development',
  entry: { 
    main: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: './JS/[name][contenthash].js',
    clean: true,
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    fallback: {
      os: false,
      fs: false,
      path: false
    }
  },

  experiments: {
    topLevelAwait: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),

  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.(eot|svg|png|jpg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'image/[name][ext]'
        }
      },
      {
        test: /\.(ttf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }

  return config;
};