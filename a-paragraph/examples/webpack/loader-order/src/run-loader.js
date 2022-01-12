/**
 * @description 使用 loader-runner 调试 loader
 */
const fs = require('fs');
const path = require('path');
const { runLoaders } = require('loader-runner');

runLoaders({
  resource: './test/demo.txt',
  loaders: [
    path.resolve(__dirname, '../loaders/raw-loader'),
  ],
  readResource: fs.readFile.bind(fs)
}, (err, result) => {
  err ? console.log(err) : console.log(result);
});
