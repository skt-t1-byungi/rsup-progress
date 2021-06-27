parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"+fUd":[function(require,module,exports) {
"use strict";var t;Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,function(t){t[t.DISAPPEAR=-1]="DISAPPEAR",t[t.NOTING=0]="NOTING",t[t.APPEAR=1]="APPEAR",t[t.PENDING=2]="PENDING",t[t.DISAPPEAR_RESTART=3]="DISAPPEAR_RESTART"}(t||(t={}));var i=150,e=function(){function e(i){void 0===i&&(i={}),this._el=document.createElement("div"),this._state=t.NOTING,this._opts={maxWidth:"99.8%",height:"4px",duration:6e4,hideDuration:400,zIndex:"9999",color:"#ff1a59",className:"",timing:"cubic-bezier(0,1,0,1)",position:"top",container:document.body},this._rafId=null,this._timerId=null,this._promises=[],this._delayTimers=[],this.setOptions(i)}return e.prototype.setOptions=function(t){n(t.maxWidth)&&(t.maxWidth=t.maxWidth+"px"),n(t.height)&&(t.height=t.height+"px"),n(t.zIndex)&&(t.zIndex=String(t.zIndex));var i=o(this._opts,t);this._el.className=i.className;var e={height:i.height,background:i.color,zIndex:i.zIndex,position:"",left:"",top:"",bottom:""};switch(i.position){case"top":e.position="fixed",e.top="0";break;case"bottom":e.position="fixed",e.bottom="0"}this._css(e)},e.prototype._css=function(t){o(this._el.style,t)},Object.defineProperty(e.prototype,"isInProgress",{get:function(){return this._state>0},enumerable:!1,configurable:!0}),e.prototype.start=function(){var i=this;switch(this._state){case t.APPEAR:case t.PENDING:case t.DISAPPEAR_RESTART:return;case t.DISAPPEAR:return void(this._state=t.DISAPPEAR_RESTART)}this._state=t.APPEAR;var e=this._opts,s="width "+e.duration+"ms "+e.timing;this._css({width:"0",opacity:"1",transition:s,webkitTransition:s}),e.container.appendChild(this._el),this._rafId=requestAnimationFrame(function(){i._rafId=requestAnimationFrame(function(){i._rafId=null,i._state=t.PENDING,i._css({width:i._opts.maxWidth})})})},e.prototype.end=function(e){var s=this;switch(void 0===e&&(e=!1),this._promises=[],this._delayTimers.splice(0).forEach(clearTimeout),this._state){case t.NOTING:return;case t.APPEAR:return this._state=t.NOTING,cancelAnimationFrame(this._rafId),this._rafId=null,void r(this._el);case t.DISAPPEAR:case t.DISAPPEAR_RESTART:return void(e?(this._state=t.NOTING,clearTimeout(this._timerId),this._timerId=null,r(this._el)):this._state=t.DISAPPEAR)}if(e)return this._state=t.NOTING,void r(this._el);this._state=t.DISAPPEAR;var n=this._opts,o="width 50ms, opacity "+n.hideDuration+"ms "+i+"ms";this._css({width:"100%",opacity:"0",transition:o,webkitTransition:o}),this._timerId=setTimeout(function(){s._timerId=null;var i=s._state===t.DISAPPEAR_RESTART;s._state=t.NOTING,r(s._el),i&&s.start()},n.hideDuration+i)},e.prototype.promise=function(t,i){var e,s=this,n=void 0===i?{}:i,o=n.delay,r=void 0===o?0:o,a=n.min,h=void 0===a?100:a;h>0&&(t=Promise.all([t,new Promise(function(t){return setTimeout(t,h)})]).then(function(t){return t[0]}));var c=function(){s._promises.push(t),s.start()},u=function(){var t=s._delayTimers;t.splice(t.indexOf(e),1),e=null};r>0?this._delayTimers.push(e=setTimeout(function(){u(),c()},r)):c();var d=function(){if(e)return clearTimeout(e),void u();var i=s._promises,n=i.indexOf(t);~n&&(i.splice(n,1),0===i.length&&s.end())};return t.then(function(t){return d(),t},function(t){return d(),Promise.reject(t)})},e}(),s=e;function n(t){return"number"==typeof t}function o(t,i){for(var e in i)Object.prototype.hasOwnProperty.call(i,e)&&(t[e]=i[e]);return t}function r(t){t.parentNode&&t.parentNode.removeChild(t)}exports.default=s;
},{}],"EVxB":[function(require,module,exports) {
"use strict";var e=r(require("../src"));function r(e){return e&&e.__esModule?e:{default:e}}window.progress=new e.default({height:5}),window.delay=function(e){return new Promise(function(r){return setTimeout(r,e)})};
},{"../src":"+fUd"}]},{},["EVxB"], null)
//# sourceMappingURL=app.e8621112.js.map