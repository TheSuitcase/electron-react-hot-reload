'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {

  var buffer = function buffer(file, enc, cb) {
    if (!isJsx(file.path)) {
      cb(null, file);
      return;
    }

    var originalPath = file.path;

    // Change file path from 'Component.jsx' to '_Component.jsx'
    file.path = addUnderscoreToFileName(file.path);
    var orginialFilename = _path2.default.basename(file.path);
    var newFileName = replaceExtension(orginialFilename, 'js');
    console.log('newfilename', newFileName);
    this.push(new _vinyl2.default({
      base: file.base,
      path: originalPath,
      contents: new Buffer(proxyFile(newFileName))
    }));

    cb(null, file);
  };

  var endStream = function endStream(cb) {
    cb();
  };

  return _through2.default.obj(buffer, endStream);
};

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Tranfrom .jsx files into 
// _component.js (actual contents)
// component.js (proxy)

var proxyFile = function proxyFile(filename) {
  return [
  // `import { ReactProxy } from 'electron-react-hot-reload'`,
  'import { ReactProxy, DefaultProxy } from \'' + _path2.default.join(__dirname, '../dist') + '\'', 'import React from \'react\'', 'import * as im from \'./' + filename + '\'', 'const im2 = {...im}', 'const forExport = {__esModule: true}', 'console.log(\'import\', im)', '\n      console.log(\'proxyFile: \', \'' + filename + '\')\n      Object.keys(im).forEach((item) => {\n        if(Object.getPrototypeOf(im[item]).name === \'ReactComponent\'){\n          im2[item] = new ReactProxy(im[item], __dirname + \'/' + filename + '\')\n        }else{\n          im2[item] = new DefaultProxy({default: im[item]}, item, __dirname + \'/' + filename + '\')\n          // im2[item] = new Proxy({default: im[item]}, {\n          //   get(obj, method, proxy){\n          //     console.log(\'get\', method)\n          //     // return Reflect.get(obj.default, method);\n          //     if(method === \'toString\'){\n          //       return () => {return obj.default.toString() }\n          //       // return obj.default.toString\n          //     }\n          //     return obj.default[method]\n          //   }\n\n          // })\n        }\n      })\n\n\n      console.log(\'exports\', im2)\n      im2.__esModule = true;\n      module.exports = im2\n    '].join('\n');
};

var isJsx = function isJsx(filePath) {
  return _path2.default.extname(filePath) === '.jsx';
};

var addUnderscoreToFileName = function addUnderscoreToFileName(path) {
  var slices = path.split('/');
  var filename = slices.pop();

  slices.push('_' + filename);

  return slices.join('/');
};

var replaceExtension = function replaceExtension(filename, extension) {
  var slices = filename.split('.');
  var oldExtension = slices.pop();
  slices.push(extension);
  return slices.join('.');
};