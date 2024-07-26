const fs = require('fs');
const path = require('path');

const filesToConcat = [
	'audio.js',
	'engine.js',
	'game.js',
	'analytics.js'
];

const outputPath = './dist/js/app.min.js';
let concatenatedContent = '';

filesToConcat.forEach((fileName) => {
	const filePath = path.join('./src/js/', fileName);
	concatenatedContent += fs.readFileSync(filePath, 'utf-8') + '\n';
});

concatenatedContent = concatenatedContent.replace(/[\r\n\t]/g, '').replace(/ +(?= )/g,'');;
fs.writeFileSync(outputPath, concatenatedContent, 'utf-8');
console.log('Files concatenated successfully into', outputPath);