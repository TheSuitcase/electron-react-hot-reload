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
    file.path = addUnderscoreToFileName(file, '_[filename].jsx');
    var orginialFilename = _path2.default.basename(file.path);
    var newFilename = replaceExtension(orginialFilename, 'js');

    this.push(new _vinyl2.default({
      path: _path2.default.basename(originalPath),
      contents: new Buffer(proxyFile(newFilename))
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
  return ['import { ReactProxy } from \'electron-react-hot-reload\'', 'import Component from \'./' + filename + '\'', 'export default new ReactProxy(Component, __dirname + \'/' + filename + '\')'].join('\n');
};

var isJsx = function isJsx(filePath) {
  return _path2.default.extname(filePath) === '.jsx';
};

var addUnderscoreToFileName = function addUnderscoreToFileName(file) {
  var path = file.path;

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