/* eslint-disable */
'use strict';

var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'src', 'js', 'app.js');

var config = {
	devtool: 'eval',
	entry: [
		'webpack/hot/dev-server',
		'webpack-dev-server/client?http://localhost:8080',
		mainPath],
	output: {
		filename: 'app.min.js',
		path: buildPath,
		publicPath: '/build/',
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader!postcss-loader',
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
	plugins: [new Webpack.HotModuleReplacementPlugin()],
	postcss: function () {
        return [require('autoprefixer')];
    }
};

module.exports = config;
