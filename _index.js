'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electronReactHotReload = require('electron-react-hot-reload');

var _index = require('./_index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _electronReactHotReload.ReactProxy(_index2.default, __dirname + '/_index.js');