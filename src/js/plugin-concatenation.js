const fs = require('fs');
const path = require('path');

class ConcatenationPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ConcatenationPlugin', (compilation, callback) => {
      const { filesToConcat, outputPath, fileName } = this.options;
      let concatenatedContent = '';

      filesToConcat.forEach((filePath) => {
        const absolutePath = path.resolve(compiler.context, filePath);
        concatenatedContent += fs.readFileSync(absolutePath, 'utf-8') + '\n';
      });

      const outputFilePath = path.join(outputPath, fileName);
      compilation.assets[outputFilePath] = {
        source: () => concatenatedContent,
        size: () => concatenatedContent.length,
      };

      callback();
    });
  }
}


module.exports = ConcatenationPlugin;