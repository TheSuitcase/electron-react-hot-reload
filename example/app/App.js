'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electronReactHotReload = require('electron-react-hot-reload');

var _App = require('./_App.js');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _electronReactHotReload.ReactProxy(_App2.default, __dirname + '/_App.js');