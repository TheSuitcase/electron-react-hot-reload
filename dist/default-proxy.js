'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Handler = function () {
  function Handler(_ref) {
    var _ref$targets = _ref.targets,
        targets = _ref$targets === undefined ? [] : _ref$targets,
        newComponent = _ref.newComponent;

    _classCallCheck(this, Handler);

    this.targets = targets;
    this.newComponent = newComponent;
  }

  _createClass(Handler, [{
    key: 'setNewComponent',
    value: function setNewComponent(newComponent) {
      this.newComponent = newComponent;
    }
  }, {
    key: 'get',
    value: function get(target, key) {
      console.log('get', target, key);
      if (method === 'toString') {
        return function () {
          return target.default.toString();
        };
        // return obj.default.toString
      }
      return target.default[method];
    }
  }]);

  return Handler;
}();

var InnerProxy = function () {
  function InnerProxy(_ref2) {
    var Component = _ref2.Component,
        outerProxy = _ref2.outerProxy;

    _classCallCheck(this, InnerProxy);

    this.Component = Component;
    this.outerProxy = outerProxy;
  }

  _createClass(InnerProxy, [{
    key: 'construct',
    value: function construct(target, args) {
      return new Proxy(new (Function.prototype.bind.apply(target, [null].concat(_toConsumableArray(args))))(), this.outerProxy);
    }
  }]);

  return InnerProxy;
}();

var ReactProxy = function () {
  function ReactProxy(Component, name, filename) {
    _classCallCheck(this, ReactProxy);

    this.Component = Component;
    this.newComponent = Component;

    this.filename = filename;
    this.targets = [];
    this.watch;
    this.name = name;

    // this.outerProxy = new OuterProxy({
    //   targets: this.targets,
    //   newComponent: this.newComponent,
    // })

    // this.innerProxy = new InnerProxy({
    //   Component: this.Component,
    //   outerProxy: this.outerProxy
    // })

    this.watchFile();

    return new Proxy(this.Component, {
      get: this.get.bind(this)
    });
  }

  _createClass(ReactProxy, [{
    key: 'watchFile',
    value: function watchFile() {
      this.watcher = _chokidar2.default.watch(this.filename, {
        ignored: /(^|[\/\\])\../,
        persistent: true
      });

      this.watcher.on('change', this.fileDidChange.bind(this));
    }
  }, {
    key: 'get',
    value: function get(target, method) {
      var _this = this;

      if (method === 'toString') {
        return function () {
          return _this.newComponent.default.toString();
        };
        // return obj.default.toString
      }
      return this.newComponent.default[method];
    }
  }, {
    key: 'fileDidChange',
    value: function fileDidChange(path) {
      // Empty the current cache for this file.
      delete require.cache[path];

      // Reload the file.
      var Component = require(path);
      // const name = this.Component.name
      var name = this.name;
      console.log('file did change');
      if (Component[name]) {
        Component = Component[name];
      } else if (Component.default.name == name) {
        Component = Component.default;
      } else {
        console.log('Could not find ' + name + ' in ' + path);
        return;
      }

      // const newComponent = new Component();
      this.newComponent = { default: Component };

      // Update all targets and make them rerender.
      this.forceUpdateAllTargets();
    }
  }, {
    key: 'forceUpdateAllTargets',
    value: function forceUpdateAllTargets() {
      console.log('targets', this.targets);
      this.targets.forEach(function (target) {
        target.forceUpdate();
      });
    }
  }]);

  return ReactProxy;
}();

exports.default = ReactProxy;