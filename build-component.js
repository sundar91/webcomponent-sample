const fs = require('fs-extra');
const concat = require('concat');

build = async () =>{
    let files = [
        './dist/hangman-web-component/runtime.js',
        './dist/hangman-web-component/polyfills.js',
        './dist/hangman-web-component/main.js'
      ];
    
      await fs.ensureDir('dist');
      await concat(files, 'dist/hangman-web-component.bundle.js');

      files = [
        './dist/tic-tac-toe-component/runtime.js',
        './dist/tic-tac-toe-component/polyfills.js',
        './dist/tic-tac-toe-component/main.js'
      ];
    
      await fs.ensureDir('dist');
      await concat(files, 'dist/tic-tac-toe.bundle.js');
}
build();