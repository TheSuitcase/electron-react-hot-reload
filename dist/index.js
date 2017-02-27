'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultProxy = exports.ReactProxy = undefined;

var _gulp = require('./gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _defaultProxy = require('./default-proxy');

var _defaultProxy2 = _interopRequireDefault(_defaultProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ReactProxy = _proxy2.default;
exports.DefaultProxy = _defaultProxy2.default;
exports.default = _gulp2.default;