const path = require('path');
const fs = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const CopyPlugin = require("copy-webpack-plugin");

const pages = ['hangman', 'tictactoe'];

module.exports = {
  entry: 
    pages.reduce((config, page) =>{
       config[page] = `./dist/${page}/main.js`
       return config;
    }, {}),
  output: {
   // filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
 module: {
   rules: [
     {
       test: /\.css$/i,
       use: ['style-loader', 'css-loader'],
     },
     {
      test: /\.?js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      exclude: /node_modules/,
    }
   ],
 },
 optimization:{
     splitChunks : {
         chunks : 'all'
     }
 },
 plugins: [

      ...pages.map((page)=>
         new HtmlWebpackPlugin({
          inject: false,
          template: `./${page}.html`,
          filename: `${page}.html`,
          chunks: [page],
        })
      ),
      new HtmlWebpackPlugin({
        inject: false,
        template: `./index.html`,
        filename: 'index.html',
      }),
      new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, "dist/hangman/styles.css"), to: path.resolve(__dirname, "build/hangman/styles.css") },
          { from:  path.resolve(__dirname, "dist/tictactoe/styles.css"), to: path.resolve(__dirname, "build/tictactoe/styles.css") },
        ],
      }),
      new MergeIntoSingleFilePlugin({
        files:
         pages.reduce((fileConfig, page)=>{
            
            let scriptPath = path.resolve(__dirname, `dist/${page}/scripts.js`);

            let exists = fs.existsSync(scriptPath);

            fileConfig[`${page}.bundle.js`] =  [
              path.resolve(__dirname, `dist/${page}/runtime.js`),
              path.resolve(__dirname, `dist/${page}/polyfills.js`),
              path.resolve(__dirname, `dist/${page}/main.js`),
            ];

            if(exists)
              fileConfig[`${page}.bundle.js`] = [...fileConfig[`${page}.bundle.js`],  (scriptPath)];

           return fileConfig;
         }, {}) 
     })
 ]

};