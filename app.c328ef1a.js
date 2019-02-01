// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../src/index.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Progress =
/** @class */
function () {
  function Progress(userOpts) {
    if (userOpts === void 0) {
      userOpts = {};
    }

    this._isProgress = false;
    this._isHiding = false;
    this._isScheduled = false;
    this._tickId = null;
    this._promises = [];
    this._el = document.createElement('div');
    this.setOptions(userOpts);
  }

  Progress.prototype.setOptions = function (userOpts) {
    assertProp(userOpts, 'maxWidth', ['number', 'string']);
    assertProp(userOpts, 'height', ['number', 'string']);
    assertProp(userOpts, 'duration', 'number');
    assertProp(userOpts, 'hideDuration', 'number');
    assertProp(userOpts, 'zIndex', ['number', 'string']);
    assertProp(userOpts, 'color', 'string');

    if (userOpts.className && typeof userOpts.className !== 'string' && !Array.isArray(userOpts.className)) {
      throw new TypeError("[rsup-progress] Expected `className` to be of type \"string, string[]\".");
    }

    var opts = this._opts = normalizeOptions(userOpts);
    this._el.className = opts.className;

    this._css({
      position: 'fixed',
      zIndex: opts.zIndex,
      top: '0',
      left: '0',
      height: opts.height,
      background: opts.color
    });
  };

  Progress.prototype._css = function (style) {
    Object.assign(this._el.style, style);
  };

  Object.defineProperty(Progress.prototype, "isProgress", {
    get: function get() {
      return this._isProgress;
    },
    enumerable: true,
    configurable: true
  });

  Progress.prototype.start = function () {
    var _this = this;

    if (this._isProgress) {
      if (this._isHiding) this._isScheduled = true;
      return;
    }

    this._isProgress = true;
    var transition = "width " + this._opts.duration + "ms cubic-bezier(0,1,0,1)";

    this._css({
      width: '0',
      opacity: '1',
      transition: transition,
      webkitTransition: transition
    });

    document.body.appendChild(this._el);

    this._nextTick(function () {
      _this._nextTick(function () {
        _this._css({
          width: _this._opts.maxWidth
        });

        _this._tickId = null;
      });
    });
  };

  Progress.prototype._nextTick = function (fn) {
    this._tickId = (requestAnimationFrame || setTimeout)(fn);
  };

  Progress.prototype._clearTick = function () {
    if (this._tickId) {
      (cancelAnimationFrame || clearTimeout)(this._tickId);
      this._tickId = null;
    }
  };

  Progress.prototype.end = function (immediately) {
    var _this = this;

    if (immediately === void 0) {
      immediately = false;
    }

    this._clearPromise();

    if (this._isScheduled) this._isScheduled = false;
    if (!this._isProgress || this._isHiding) return;

    if (this._tickId || immediately) {
      this._isProgress = false;
      document.body.removeChild(this._el);
      if (this._tickId) this._clearTick();
      return;
    }

    this._isHiding = true;
    var PERSIST_TIME = 150;
    var transition = "width 50ms, opacity " + this._opts.hideDuration + "ms " + PERSIST_TIME + "ms";

    this._css({
      width: '100%',
      opacity: '0',
      transition: transition,
      webkitTransition: transition
    });

    setTimeout(function () {
      _this._isHiding = false;
      _this._isProgress = false;
      document.body.removeChild(_this._el);

      if (_this._isScheduled) {
        _this._isScheduled = false;

        _this.start();
      }
    }, this._opts.hideDuration + PERSIST_TIME);
  };

  Progress.prototype.promise = function (promise, delay) {
    var _this = this;

    if (delay === void 0) {
      delay = 0;
    }

    this._promises.push(promise);

    var started = false;

    if (delay > 0) {
      setTimeout(function () {
        if (!_this._isProgress && _this._promises.indexOf(promise) > -1) {
          started = true;

          _this.start();
        }
      }, delay);
    } else {
      started = true;
      this.start();
    }

    var onFinally = function onFinally() {
      _this._clearPromise(promise);

      if (started && _this._promises.length === 0 && _this._isProgress) _this.end();
    };

    return promise.then(function (val) {
      return onFinally(), val;
    }, function (err) {
      return onFinally(), Promise.reject(err);
    });
  };

  Progress.prototype._clearPromise = function (promise) {
    this._promises = promise ? this._promises.filter(function (p) {
      return p !== promise;
    }) : [];
  };

  return Progress;
}();

exports.Progress = Progress;
exports.default = Progress;

function normalizeOptions(opts) {
  opts = __assign({
    maxWidth: '99.7%',
    height: '4px',
    duration: 90000,
    hideDuration: 400,
    zIndex: '9999',
    color: '#ff1a59',
    className: ''
  }, opts);
  if (typeof opts.maxWidth === 'number') opts.maxWidth = opts.maxWidth + 'px';
  if (typeof opts.height === 'number') opts.height = opts.height + 'px';
  if (typeof opts.zIndex === 'number') opts.zIndex = String(opts.zIndex);
  if (Array.isArray(opts.className)) opts.className = opts.className.join(' ');
  return opts;
}

function assertProp(obj, prop, expected) {
  var type = _typeof(obj[prop]);

  if (type === 'undefined') return;
  if (typeof expected === 'string') expected = [expected];
  if (expected.indexOf(type) > -1) return;
  throw new TypeError("[rsup-progress] Expected `" + prop + "` to be of type \"" + expected.join(', ') + "\", but \"" + type + "\".");
}
},{}],"app.js":[function(require,module,exports) {
"use strict";

var _src = require("../src/");

var progress = new _src.Progress();
progress.start();
window.progress = progress;
},{"../src/":"../src/index.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "11033" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.map