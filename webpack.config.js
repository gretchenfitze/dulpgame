module.exports = {
	devServer: {
		contentBase: './public',
	},
	entry: {
		app: './src/js/app.js',
	},
	output: {
		filename: '[name].min.js',
		path: 'public/js/',
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style!css',
			},
			{
				test: /\.js$/,
				loader: 'babel',
				query: {
					presets: ['es2015'],
				},
			},
			{
				test: /\.(js)$/,
				exclude: [/node_modules/],
				loader: 'babel?cacheDirectory=true',
			},
		],
	},
};
