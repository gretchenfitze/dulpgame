/* eslint-disable */
'use strict';

var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'src', 'js', 'app.js');

var config = {
  devtool: 'source-map',
  entry: mainPath,
  output: {
    path: buildPath,
    filename: 'app.min.js',
  },
  module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
			},
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: [nodeModulesPath],
				query: {
					presets: ['es2015'],
				},
			},
		],
	},
};

module.exports = config;
