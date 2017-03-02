/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _index = __webpack_require__(1);

	var stage = new _index.Stage(480, 480, "body");
	var graphics = new _index.Graphics();
	graphics.beginPath().arc(377 / 4 - 58, 391 / 4 - 58, 140 / 4, 0, Math.PI * 2).closePath().fillStyle('#f4862c').fill().strokeStyle("#046ab4").lineWidth(8 / 4).stroke().beginPath().moveTo(298 / 4 - 58, 506 / 4 - 58).bezierCurveTo(236 / 4 - 58, 396 / 4 - 58, 302 / 4 - 58, 272 / 4 - 58, 407 / 4 - 58, 254 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(328 / 4 - 58, 258 / 4 - 58).bezierCurveTo(360 / 4 - 58, 294 / 4 - 58, 451 / 4 - 58, 272 / 4 - 58, 503 / 4 - 58, 332 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(282 / 4 - 58, 288 / 4 - 58).bezierCurveTo(391 / 4 - 58, 292 / 4 - 58, 481 / 4 - 58, 400 / 4 - 58, 488 / 4 - 58, 474 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(242 / 4 - 58, 352 / 4 - 58).bezierCurveTo(352 / 4 - 58, 244 / 4 - 58, 319 / 4 - 58, 423 / 4 - 58, 409 / 4 - 58, 527 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke();

	graphics.x = graphics.y = 200;

	graphics.addEventListener('click', function () {

	    alert(1);
	}, true);

	stage.add(graphics);
	stage.update();

	console.log(graphics);
	//setInterval(()=>{
	//    graphics.rotation++
	//    stage.update();
	//},16)

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _alloy_render = __webpack_require__(2);

	var _alloy_render2 = _interopRequireDefault(_alloy_render);

	var _matrix2d = __webpack_require__(3);

	var _matrix2d2 = _interopRequireDefault(_matrix2d);

	var _display_object = __webpack_require__(4);

	var _display_object2 = _interopRequireDefault(_display_object);

	var _container = __webpack_require__(5);

	var _container2 = _interopRequireDefault(_container);

	var _stage = __webpack_require__(6);

	var _stage2 = _interopRequireDefault(_stage);

	var _graphics = __webpack_require__(8);

	var _graphics2 = _interopRequireDefault(_graphics);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_alloy_render2.default.Matrix2D = _matrix2d2.default;
	_alloy_render2.default.Stage = _stage2.default;
	_alloy_render2.default.DisplayObject = _display_object2.default;
	_alloy_render2.default.Container = _container2.default;
	_alloy_render2.default.Graphics = _graphics2.default;

	window.AlloyRender = _alloy_render2.default;
	module.exports = _alloy_render2.default;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var AlloyRender = {};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DEG_TO_RAD = 0.017453292519943295;

	var Matrix2D = function () {
	    function Matrix2D(a, b, c, d, tx, ty) {
	        _classCallCheck(this, Matrix2D);

	        this.a = a == null ? 1 : a;
	        this.b = b || 0;
	        this.c = c || 0;
	        this.d = d == null ? 1 : d;
	        this.tx = tx || 0;
	        this.ty = ty || 0;
	        return this;
	    }

	    _createClass(Matrix2D, [{
	        key: "identity",
	        value: function identity() {
	            this.a = this.d = 1;
	            this.b = this.c = this.tx = this.ty = 0;
	            return this;
	        }
	    }, {
	        key: "appendTransform",
	        value: function appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
	            if (rotation % 360) {
	                var r = rotation * DEG_TO_RAD;
	                var cos = Math.cos(r);
	                var sin = Math.sin(r);
	            } else {
	                cos = 1;
	                sin = 0;
	            }
	            if (skewX || skewY) {
	                skewX *= AlloyPaper.Matrix2D.DEG_TO_RAD;
	                skewY *= AlloyPaper.Matrix2D.DEG_TO_RAD;
	                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
	                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
	            } else {
	                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
	            }
	            if (regX || regY) {
	                this.tx -= regX * this.a + regY * this.c;
	                this.ty -= regX * this.b + regY * this.d;
	            }
	            return this;
	        }
	    }, {
	        key: "append",
	        value: function append(a, b, c, d, tx, ty) {
	            var a1 = this.a;
	            var b1 = this.b;
	            var c1 = this.c;
	            var d1 = this.d;
	            this.a = a * a1 + b * c1;
	            this.b = a * b1 + b * d1;
	            this.c = c * a1 + d * c1;
	            this.d = c * b1 + d * d1;
	            this.tx = tx * a1 + ty * c1 + this.tx;
	            this.ty = tx * b1 + ty * d1 + this.ty;
	            return this;
	        }
	    }, {
	        key: "initialize",
	        value: function initialize(a, b, c, d, tx, ty) {
	            this.a = a;
	            this.b = b;
	            this.c = c;
	            this.d = d;
	            this.tx = tx;
	            this.ty = ty;
	            return this;
	        }
	    }, {
	        key: "setValues",
	        value: function setValues(a, b, c, d, tx, ty) {
	            this.a = a == null ? 1 : a;
	            this.b = b || 0;
	            this.c = c || 0;
	            this.d = d == null ? 1 : d;
	            this.tx = tx || 0;
	            this.ty = ty || 0;
	            return this;
	        }
	    }, {
	        key: "copy",
	        value: function copy(matrix) {
	            return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	        }
	    }]);

	    return Matrix2D;
	}();

	exports.default = Matrix2D;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _matrix2d = __webpack_require__(3);

	var _matrix2d2 = _interopRequireDefault(_matrix2d);

	var _event_dispatcher = __webpack_require__(10);

	var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DisplayObject = function (_EventDispatcher) {
	    _inherits(DisplayObject, _EventDispatcher);

	    function DisplayObject() {
	        _classCallCheck(this, DisplayObject);

	        var _this = _possibleConstructorReturn(this, (DisplayObject.__proto__ || Object.getPrototypeOf(DisplayObject)).call(this));

	        _this.alpha = _this.scaleX = _this.scaleY = 1;
	        _this.x = _this.y = _this.rotation = _this.skewX = _this.skewY = _this.regX = _this.regY = 0;
	        _this.cursor = "default";
	        _this._matrix = new _matrix2d2.default();
	        _this._hitMatrix = new _matrix2d2.default();
	        return _this;
	    }

	    _createClass(DisplayObject, [{
	        key: '_computeMatrix',
	        value: function _computeMatrix() {
	            this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
	        }
	    }]);

	    return DisplayObject;
	}(_event_dispatcher2.default);

	exports.default = DisplayObject;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _display_object = __webpack_require__(4);

	var _display_object2 = _interopRequireDefault(_display_object);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Container = function (_DisplayObject) {
	    _inherits(Container, _DisplayObject);

	    function Container(data) {
	        _classCallCheck(this, Container);

	        var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, data));

	        _this.children = [];
	        return _this;
	    }

	    _createClass(Container, [{
	        key: 'add',
	        value: function add(child) {

	            this.children.push(child);
	            child.parent = this;
	        }
	    }]);

	    return Container;
	}(_display_object2.default);

	exports.default = Container;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _container = __webpack_require__(5);

	var _container2 = _interopRequireDefault(_container);

	var _canvas_render = __webpack_require__(7);

	var _canvas_render2 = _interopRequireDefault(_canvas_render);

	var _hit_render = __webpack_require__(11);

	var _hit_render2 = _interopRequireDefault(_hit_render);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Stage = function (_Container) {
	    _inherits(Stage, _Container);

	    function Stage(width, height, renderTo) {
	        _classCallCheck(this, Stage);

	        var _this = _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this));

	        _this.renderTo = typeof renderTo === 'string' ? document.querySelector(renderTo) : renderTo;
	        _this.canvas = document.createElement('canvas');
	        _this.canvas.width = width;
	        _this.canvas.height = height;
	        _this.renderTo.appendChild(_this.canvas);
	        _this.renderer = new _canvas_render2.default(_this.canvas);

	        _this.canvas.addEventListener('click', function (evt) {
	            _this._handleClick(evt);
	        });

	        _this.borderTopWidth = 0;
	        _this.borderLeftWidth = 0;

	        _this.hitAABB = false;
	        _this._hitRender = new _hit_render2.default();
	        return _this;
	    }

	    _createClass(Stage, [{
	        key: '_handleClick',
	        value: function _handleClick(evt) {
	            var rect = this.canvas.getBoundingClientRect();
	            evt.stageX = evt.clientX - rect.left - this.borderLeftWidth;
	            evt.stageY = evt.clientY - rect.top - this.borderTopWidth;
	            this._getObjectUnderPoint(evt);
	        }
	    }, {
	        key: '_getObjectUnderPoint',
	        value: function _getObjectUnderPoint(evt) {
	            if (this.hitAABB) {
	                return this._hitRender.hitAABB(this, evt);
	            } else {
	                return this._hitRender.hitPixel(this, evt);
	            }
	        }
	    }, {
	        key: 'update',
	        value: function update() {
	            var _this2 = this;

	            this.renderer.clear();
	            this.children.forEach(function (child) {
	                _this2.renderer.render(child);
	            });
	        }
	    }]);

	    return Stage;
	}(_container2.default);

	exports.default = Stage;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _container = __webpack_require__(5);

	var _container2 = _interopRequireDefault(_container);

	var _graphics = __webpack_require__(8);

	var _graphics2 = _interopRequireDefault(_graphics);

	var _render = __webpack_require__(9);

	var _render2 = _interopRequireDefault(_render);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CanvasRender = function (_Render) {
	    _inherits(CanvasRender, _Render);

	    function CanvasRender(canvas) {
	        _classCallCheck(this, CanvasRender);

	        var _this = _possibleConstructorReturn(this, (CanvasRender.__proto__ || Object.getPrototypeOf(CanvasRender)).call(this));

	        _this.ctx = canvas.getContext('2d');
	        _this.canvas = canvas;
	        _this.width = _this.canvas.width;
	        _this.height = _this.canvas.height;
	        return _this;
	    }

	    _createClass(CanvasRender, [{
	        key: 'render',
	        value: function render(obj) {
	            this.ctx.save();
	            obj._computeMatrix();
	            this.ctx.transform(obj._matrix.a, obj._matrix.b, obj._matrix.c, obj._matrix.d, obj._matrix.tx, obj._matrix.ty);
	            if (obj instanceof _graphics2.default) {
	                this.renderGraphics(obj);
	            } else if (obj instanceof _container2.default) {}
	            this.ctx.restore();
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this.ctx.clearRect(0, 0, this.width, this.height);
	        }
	    }, {
	        key: 'hitAABB',
	        value: function hitAABB() {}
	    }, {
	        key: 'hitPixel',
	        value: function hitPixel() {}
	    }, {
	        key: 'renderGraphics',
	        value: function renderGraphics(obj) {
	            var _this2 = this;

	            obj.cmds.forEach(function (cmd) {
	                var methodName = cmd[0];
	                if (obj.assMethod.join("-").match(new RegExp("\\b" + methodName + "\\b", "g"))) {
	                    _this2.ctx[methodName] = cmd[1][0];
	                } else if (methodName === "addColorStop") {
	                    obj.currentGradient && obj.currentGradient.addColorStop(cmd[1][0], cmd[1][1]);
	                } else if (methodName === "fillGradient") {
	                    _this2.ctx.fillStyle = obj.currentGradient;
	                } else {
	                    var result = _this2.ctx[methodName].apply(_this2.ctx, Array.prototype.slice.call(cmd[1]));
	                    if (methodName === "createRadialGradient" || methodName === "createLinearGradient") {
	                        obj.currentGradient = result;
	                    }
	                }
	            });
	        }
	    }]);

	    return CanvasRender;
	}(_render2.default);

	exports.default = CanvasRender;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _display_object = __webpack_require__(4);

	var _display_object2 = _interopRequireDefault(_display_object);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Graphics = function (_DisplayObject) {
	    _inherits(Graphics, _DisplayObject);

	    function Graphics(data) {
	        _classCallCheck(this, Graphics);

	        var _this = _possibleConstructorReturn(this, (Graphics.__proto__ || Object.getPrototypeOf(Graphics)).call(this, data));

	        _this.cmds = [];
	        _this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];
	        _this.currentGradient = null;
	        return _this;
	    }

	    _createClass(Graphics, [{
	        key: "clearRect",
	        value: function clearRect(x, y, width, height) {
	            this.cmds.push(["clearRect", arguments]);
	            return this;
	        }
	    }, {
	        key: "clear",
	        value: function clear() {
	            this.cmds.length = 0;
	            return this;
	        }
	    }, {
	        key: "strokeRect",
	        value: function strokeRect() {
	            this.cmds.push(["strokeRect", arguments]);
	            return this;
	        }
	    }, {
	        key: "fillRect",
	        value: function fillRect() {
	            this.cmds.push(["fillRect", arguments]);
	            return this;
	        }
	    }, {
	        key: "beginPath",
	        value: function beginPath() {
	            this.cmds.push(["beginPath", arguments]);
	            return this;
	        }
	    }, {
	        key: "arc",
	        value: function arc() {
	            this.cmds.push(["arc", arguments]);
	            return this;
	        }
	    }, {
	        key: "closePath",
	        value: function closePath() {
	            this.cmds.push(["closePath", arguments]);
	            return this;
	        }
	    }, {
	        key: "fillStyle",
	        value: function fillStyle() {
	            this.cmds.push(["fillStyle", arguments]);
	            return this;
	        }
	    }, {
	        key: "fill",
	        value: function fill() {
	            this.cmds.push(["fill", arguments]);
	            return this;
	        }
	    }, {
	        key: "strokeStyle",
	        value: function strokeStyle() {
	            this.cmds.push(["strokeStyle", arguments]);
	            return this;
	        }
	    }, {
	        key: "lineWidth",
	        value: function lineWidth() {
	            this.cmds.push(["lineWidth", arguments]);
	            return this;
	        }
	    }, {
	        key: "stroke",
	        value: function stroke() {
	            this.cmds.push(["stroke", arguments]);
	            return this;
	        }
	    }, {
	        key: "moveTo",
	        value: function moveTo() {
	            this.cmds.push(["moveTo", arguments]);
	            return this;
	        }
	    }, {
	        key: "lineTo",
	        value: function lineTo() {
	            this.cmds.push(["lineTo", arguments]);
	            return this;
	        }
	    }, {
	        key: "bezierCurveTo",
	        value: function bezierCurveTo() {
	            this.cmds.push(["bezierCurveTo", arguments]);
	            return this;
	        }
	    }, {
	        key: "createRadialGradient",
	        value: function createRadialGradient() {
	            this.cmds.push(["createRadialGradient", arguments]);
	            return this;
	        }
	    }, {
	        key: "createLinearGradient",
	        value: function createLinearGradient() {
	            this.cmds.push(["createLinearGradient", arguments]);
	            return this;
	        }
	    }, {
	        key: "addColorStop",
	        value: function addColorStop() {
	            this.cmds.push(["addColorStop", arguments]);
	            return this;
	        }
	    }, {
	        key: "fillGradient",
	        value: function fillGradient() {
	            this.cmds.push(["fillGradient"]);
	            return this;
	        }
	    }]);

	    return Graphics;
	}(_display_object2.default);

	exports.default = Graphics;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Render = function () {
	    function Render() {
	        _classCallCheck(this, Render);
	    }

	    _createClass(Render, [{
	        key: "render",
	        value: function render() {}
	    }, {
	        key: "renderGraphics",
	        value: function renderGraphics() {}
	    }, {
	        key: "clear",
	        value: function clear() {}
	    }]);

	    return Render;
	}();

	exports.default = Render;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventDispatcher = function () {
	    function EventDispatcher() {
	        _classCallCheck(this, EventDispatcher);

	        this._listeners = null;
	        this._captureListeners = null;
	    }

	    _createClass(EventDispatcher, [{
	        key: "addEventListener",
	        value: function addEventListener(type, listener, useCapture) {
	            var listeners;
	            if (useCapture) {
	                listeners = this._captureListeners = this._captureListeners || {};
	            } else {
	                listeners = this._listeners = this._listeners || {};
	            }
	            var arr = listeners[type];
	            if (arr) {
	                this.removeEventListener(type, listener, useCapture);
	            }
	            arr = listeners[type]; // remove may have deleted the array
	            if (!arr) {
	                listeners[type] = [listener];
	            } else {
	                arr.push(listener);
	            }
	            return listener;
	        }
	    }, {
	        key: "removeEventListener",
	        value: function removeEventListener(type, listener, useCapture) {
	            var listeners = useCapture ? this._captureListeners : this._listeners;
	            if (!listeners) {
	                return;
	            }
	            var arr = listeners[type];
	            if (!arr) {
	                return;
	            }

	            arr.every(function (item, index) {
	                if (item == listener) {
	                    arr.splice(index, 1);
	                    return false;
	                }
	            });
	        }
	    }, {
	        key: "dispatchEvent",
	        value: function dispatchEvent(eventObj, bubbles, cancelable) {}
	    }]);

	    return EventDispatcher;
	}();

	exports.default = EventDispatcher;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _container = __webpack_require__(5);

	var _container2 = _interopRequireDefault(_container);

	var _graphics = __webpack_require__(8);

	var _graphics2 = _interopRequireDefault(_graphics);

	var _render = __webpack_require__(9);

	var _render2 = _interopRequireDefault(_render);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HitRender = function (_Render) {
	    _inherits(HitRender, _Render);

	    function HitRender(canvas) {
	        _classCallCheck(this, HitRender);

	        var _this = _possibleConstructorReturn(this, (HitRender.__proto__ || Object.getPrototypeOf(HitRender)).call(this));

	        _this.canvas = document.createElement('canvas');
	        _this.canvas.width = 1;
	        _this.canvas.height = 1;
	        _this.ctx = _this.canvas.getContext('2d');
	        return _this;
	    }

	    _createClass(HitRender, [{
	        key: 'render',
	        value: function render(obj) {
	            this.ctx.save();
	            obj._computeMatrix();
	            this.ctx.transform(obj._matrix.a, obj._matrix.b, obj._matrix.c, obj._matrix.d, obj._matrix.tx, obj._matrix.ty);
	            if (obj instanceof _graphics2.default) {
	                this.renderGraphics(obj);
	            } else if (obj instanceof _container2.default) {}
	            this.ctx.restore();
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this.ctx.clearRect(0, 0, this.width, this.height);
	        }
	    }, {
	        key: 'hitAABB',
	        value: function hitAABB(root, evt) {}
	    }, {
	        key: 'hitPixel',
	        value: function hitPixel(o, evt, type) {
	            var ctx = this.ctx;
	            var mtx = o._hitMatrix;
	            var list = o.children.slice(0),
	                l = list.length;
	            for (var i = l - 1; i >= 0; i--) {
	                var child = list[i];
	                mtx.initialize(1, 0, 0, 1, 0, 0);
	                mtx.appendTransform(o.x - evt.stageX, o.y - evt.stageY, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
	                if (!this.checkBoundEvent(child)) continue;
	                ctx.save();
	                var target = this._hitPixel(child, mtx, evt, type);
	                ctx.restore();
	                if (target) return target;
	            }
	        }
	    }, {
	        key: 'checkBoundEvent',
	        value: function checkBoundEvent() {
	            return true;
	        }
	    }, {
	        key: '_hitPixel',
	        value: function _hitPixel(o, evt, mtx) {
	            var ctx = this.ctx;
	            ctx.clearRect(0, 0, 2, 2);
	            if (mtx) {
	                o._hitMatrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	            } else {
	                o._hitMatrix.initialize(1, 0, 0, 1, 0, 0);
	            }
	            mtx = o._hitMatrix;

	            if (o instanceof _graphics2.default) {
	                ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	                o.draw(ctx);
	            }
	        }
	    }]);

	    return HitRender;
	}(_render2.default);

	exports.default = HitRender;

/***/ }
/******/ ]);