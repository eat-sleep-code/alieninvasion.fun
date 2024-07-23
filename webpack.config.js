const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		'invaders': [
            './src/js/game.js',
            './src/js/analytics.js'
        ]
	},
	output: {
		filename: '[name].min.js',
		path: __dirname + '/src/js/',
		hashFunction: 'xxhash64'
	},
	optimization: {
		mangleExports: false,
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false
					}
				},
				extractComments: false
			})
		]
	}
  };