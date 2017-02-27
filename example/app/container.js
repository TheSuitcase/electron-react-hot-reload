'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dist = require('/Users/dannyvanderjagt/Github/electron-react-hot-reload/dist');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _container = require('./_container.js');

var im = _interopRequireWildcard(_container);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var im2 = _extends({}, im);
var forExport = { __esModule: true };
console.log('import', im);

console.log('proxyFile: ', '_container.js');
Object.keys(im).forEach(function (item) {
  if (Object.getPrototypeOf(im[item]).name === 'ReactComponent') {
    im2[item] = new _dist.ReactProxy(im[item], __dirname + '/_container.js');
  } else {
    im2[item] = new _dist.DefaultProxy({ default: im[item] }, item, __dirname + '/_container.js');
    // im2[item] = new Proxy({default: im[item]}, {
    //   get(obj, method, proxy){
    //     console.log('get', method)
    //     // return Reflect.get(obj.default, method);
    //     if(method === 'toString'){
    //       return () => {return obj.default.toString() }
    //       // return obj.default.toString
    //     }
    //     return obj.default[method]
    //   }

    // })
  }
});

console.log('exports', im2);
im2.__esModule = true;
module.exports = im2;