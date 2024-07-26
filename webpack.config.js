const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		'invaders': [
			'./src/js/audio.js',
            './src/js/engine.js',
            './src/js/game.js',
            './src/js/analytics.js'
        ]
	},
	output: {
		filename: 'app.min.js',
		path: __dirname + '/dist/js/',
		hashFunction: 'xxhash64'
	},
	optimization: {
		mangleExports: false,
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
					format: {
						comments: false
					}
				},
				extractComments: false
			})
		]
	}
  };