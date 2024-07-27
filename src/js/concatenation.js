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


// Remove Comments
concatenatedContent = concatenatedContent.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,'');

// Remove Tabs
concatenatedContent = concatenatedContent.replace(/\t/g, '');

// Remove Leading Spaces
concatenatedContent = concatenatedContent.replace(/^ +/gm,'');

// Remove Repeated Spaces
concatenatedContent = concatenatedContent.replace(/ +(?= )/g,'');

// Remove Empty Lines
concatenatedContent = concatenatedContent.replace(/^\s*$(?:\r\n?|\n)/gm,'');



fs.writeFileSync(outputPath, concatenatedContent, 'utf-8');
console.log('Files concatenated successfully into', outputPath);