'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {

  var buffer = function buffer(file, enc, cb) {
    // console.log(file.base, Object.keys(file))
    if (!isJsx(file.path)) {
      cb(null, file);
      return;
    }

    var originalPath = file.path;

    // Change file path from 'Component.jsx' to '_Component.jsx'
    file.path = addUnderscoreToFileName(file.path);
    var orginialFilename = _path2.default.basename(file.path);
    var newFileName = replaceExtension(orginialFilename, 'js');
    // console.log('newFileName', file.path)

    var v = new _vinyl2.default({
      base: file.base,
      path: originalPath,
      contents: new Buffer(proxyFile(newFileName))
    });

    console.log(v.path);
    this.push(v);

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
  return ['import { ReactProxy } from \'electron-react-hot-reload\'', 'import Component from \'./' + filename + '\'', 'export default new ReactProxy(Component, __dirname + \'/' + filename + '\')'].join('\n');
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