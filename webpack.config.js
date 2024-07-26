const path = require('path');
const ConcatenationPlugin = require('./src/js/plugin-concatenation.js');

module.exports = {
	mode: 'production',
	entry: './src/js/game.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/js'),
	},
	plugins: [
		new ConcatenationPlugin({
			filesToConcat: [
				'./src/js/audio.js',
				'./src/js/engine.js',
				'./src/js/game.js',
				'./src/js/analytics.js'
			],
			outputPath: '.',
			fileName: 'app.min.js'
		})
	]
};