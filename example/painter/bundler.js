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

	stage.add(graphics);
	setInterval(function () {
	    graphics.rotation++;
	    stage.update();
	}, 16);

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	_alloy_render2['default'].Matrix2D = _matrix2d2['default'];
	_alloy_render2['default'].Stage = _stage2['default'];
	_alloy_render2['default'].DisplayObject = _display_object2['default'];
	_alloy_render2['default'].Container = _container2['default'];
	_alloy_render2['default'].Graphics = _graphics2['default'];

	window.AlloyRender = _alloy_render2['default'];
	module.exports = _alloy_render2['default'];

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

	exports["default"] = Matrix2D;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _matrix2d = __webpack_require__(3);

	var _matrix2d2 = _interopRequireDefault(_matrix2d);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DisplayObject = function () {
	    function DisplayObject() {
	        _classCallCheck(this, DisplayObject);

	        this.alpha = this.scaleX = this.scaleY = 1;
	        this.x = this.y = this.rotation = this.skewX = this.skewY = this.regX = this.regY = 0;
	        this.cursor = "default";
	        this._matrix = new _matrix2d2["default"]();
	    }

	    _createClass(DisplayObject, [{
	        key: "_computeMatrix",
	        value: function _computeMatrix() {
	            this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
	        }
	    }]);

	    return DisplayObject;
	}();

	exports["default"] = DisplayObject;

	//var DisplayObject = Class.extend({
	//    "ctor": function() {
	//        this.alpha = this.scaleX = this.scaleY = this.scale = 1;
	//
	//        this.textureReady = true;
	//        this.visible = true;
	//        this._matrix = new AlloyPaper.Matrix2D();
	//        this._hitMatrix = new AlloyPaper.Matrix2D();
	//        this.events = {};
	//        this.id = AlloyPaper.UID.get();
	//        this.cacheID = 0;
	//        this.baseInstanceof = "DisplayObject";
	//        this.tickFPS = 60;
	//        var self = this;
	//        this._watch(this, "originX", function(prop, value) {
	//            if (typeof value === "string") {
	//                self.regX = parseInt(value);
	//            } else {
	//                self.regX = self.width * value;
	//            }
	//        });
	//        this._watch(this, "originY", function(prop, value) {
	//            if (typeof value === "string") {
	//                self.regY = parseInt(value);
	//            } else {
	//                self.regY = self.height * value;
	//            }
	//        });
	//        this._watch(this, "filter", function(prop, value) {
	//            self.setFilter.apply(self, value);
	//        });
	//        this._watch(this, "scale", function(prop, value) {
	//            this.scaleX = this.scaleY = this.scale;
	//        });
	//        this.cursor = "default";
	//        this.onHover(function () {
	//            //this._setCursor(this, this.cursor);
	//        }, function () {
	//            this._setCursor(this, AlloyPaper.DefaultCursor);
	//        });
	//    },
	//    "_watch": function(target, prop, onPropertyChanged) {
	//        if (typeof prop === "string") {
	//            target["__" + prop] = this[prop];
	//            Object.defineProperty(target, prop, {
	//                get: function() {
	//                    return this["__" + prop];
	//                },
	//                set: function(value) {
	//                    this["__" + prop] = value;
	//                    onPropertyChanged.apply(target, [prop, value]);
	//                }
	//            });
	//        } else {
	//            for (var i = 0, len = prop.length; i < len; i++) {
	//                var propName = prop[i];
	//                target["__" + propName] = this[propName];
	//                (function(propName) {
	//                    Object.defineProperty(target, propName, {
	//                        get: function() {
	//                            return this["__" + propName];
	//                        },
	//                        set: function(value) {
	//                            this["__" + propName] = value;
	//                            onPropertyChanged.apply(target, [propName, value]);
	//                        }
	//                    });
	//                })(propName);
	//            }
	//        }
	//    },
	//    "isVisible": function() {
	//        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.textureReady);
	//    },
	//    "on": function(type, fn) {
	//        this.events[type] || (this.events[type] = []);
	//        this.events[type].push(fn);
	//    },
	//    "off": function (type, fn) {
	//        var fns=this.events[type];
	//        if (fns) {
	//            var i = 0, len = fns.length;
	//            for (; i < len; i++) {
	//                if (fns[i] === fn) {
	//                    fns.splice(i, 1);
	//                    break;
	//                }
	//            }
	//        }
	//
	//    },
	//    "execEvent": function (type, event) {
	//        if (this.events) {
	//            var fns = this.events[type],
	//                result = true;
	//            if (fns) {
	//                for (var i = 0, len = fns.length; i < len; i++) {
	//                    result = fns[i].call(this, event);
	//                }
	//            }
	//            return result;
	//        }
	//    },
	//    "_setCursor": function (obj, type) {
	//        if (obj) {
	//            if (obj.parent instanceof AlloyPaper.Stage) {
	//                obj.parent.setCursor(type);
	//            } else {
	//                this._setCursor(obj.parent, type);
	//            }
	//        }
	//    },
	//    "clone": function() {
	//        var o = new AlloyPaper.DisplayObject();
	//        this.cloneProps(o);
	//        return o;
	//    },
	//    "cloneProps": function(o) {
	//        o.visible = this.visible;
	//        o.alpha = this.alpha;
	//        o.originX = this.originX;
	//        o.originY = this.originY;
	//        o.rotation = this.rotation;
	//        o.scaleX = this.scaleX;
	//        o.scaleY = this.scaleY;
	//        o.skewX = this.skewX;
	//        o.skewY = this.skewY;
	//        o.x = this.x;
	//        o.y = this.y;
	//        o.regX = this.regX;
	//        o.regY = this.regY;
	//    },
	//    "cache": function() {
	//        if (!this.cacheCanvas) {
	//            this.cacheCanvas = document.createElement("canvas");
	//            var bound = this.getBound();
	//            this.cacheCanvas.width = bound.width;
	//            this.cacheCanvas.height = bound.height;
	//            this.cacheCtx = this.cacheCanvas.getContext("2d");
	//        }
	//        this.cacheID = AlloyPaper.UID.getCacheID();
	//        this.updateCache(this.cacheCtx, this, bound.width, bound.width);
	//    },
	//    "uncache": function() {
	//        this.cacheCanvas = null;
	//        this.cacheCtx = null;
	//        this.cacheID = null;
	//    },
	//    "setFilter": function(r, g, b, a) {
	//        if (this.width === 0 || this.height === 0) return;
	//        this.uncache();
	//        this.cache();
	//        var imageData = this.cacheCtx.getImageData(0, 0, this.cacheCanvas.width, this.cacheCanvas.height);
	//        var pix = imageData.data;
	//        for (var i = 0, n = pix.length; i < n; i += 4) {
	//            if (pix[i + 3] > 0) {
	//                pix[i] *= r;
	//                pix[i + 1] *= g;
	//                pix[i + 2] *= b;
	//                pix[i + 3] *= a;
	//            }
	//        }
	//        this.cacheCtx.putImageData(imageData, 0, 0);
	//    },
	//    "getBound": function() {
	//        return {
	//            width: this.width,
	//            height: this.height
	//        };
	//    },
	//    "toCenter": function() {
	//        this.originX = .5;
	//        this.originY = .5;
	//        this.x = this.parent.width / 2;
	//        this.y = this.parent.height / 2;
	//    },
	//    "destroy": function() {
	//        this.cacheCanvas = null;
	//        this.cacheCtx = null;
	//        this.cacheID = null;
	//        this._matrix = null;
	//        this.events = null;
	//        if (this.parent) {
	//            this.parent.remove(this);
	//        }
	//    },
	//    "initAABB": function() {
	//        var x,
	//            y,
	//            width = this.width,
	//            height = this.height,
	//            mtx = this._matrix;
	//        var x_a = width * mtx.a,
	//            x_b = width * mtx.b;
	//        var y_c = height * mtx.c,
	//            y_d = height * mtx.d;
	//        var tx = mtx.tx,
	//            ty = mtx.ty;
	//        var minX = tx,
	//            maxX = tx,
	//            minY = ty,
	//            maxY = ty;
	//        if ((x = x_a + tx) < minX) {
	//            minX = x;
	//        } else if (x > maxX) {
	//            maxX = x;
	//        }
	//        if ((x = x_a + y_c + tx) < minX) {
	//            minX = x;
	//        } else if (x > maxX) {
	//            maxX = x;
	//        }
	//        if ((x = y_c + tx) < minX) {
	//            minX = x;
	//        } else if (x > maxX) {
	//            maxX = x;
	//        }
	//        if ((y = x_b + ty) < minY) {
	//            minY = y;
	//        } else if (y > maxY) {
	//            maxY = y;
	//        }
	//        if ((y = x_b + y_d + ty) < minY) {
	//            minY = y;
	//        } else if (y > maxY) {
	//            maxY = y;
	//        }
	//        if ((y = y_d + ty) < minY) {
	//            minY = y;
	//        } else if (y > maxY) {
	//            maxY = y;
	//        }
	//        this.AABB = [minX, minY, maxX - minX, maxY - minY];
	//        this.rectPoints = [{
	//            x: tx,
	//            y: ty},{
	//            x: x_a + tx,
	//            y: x_b + ty},{
	//            x: x_a + y_c + tx,
	//            y: x_b + y_d + ty},{
	//            x: y_c + tx,
	//            y: y_d + ty}];
	//    },
	//    "updateCache": function(ctx, o, w, h) {
	//        ctx.clearRect(0, 0, w + 1, h + 1);
	//        this.renderCache(ctx, o);
	//    },
	//    "renderCache": function(ctx, o) {
	//        if (!o.isVisible()) {
	//            return;
	//        }
	//        if (o instanceof AlloyPaper.Container || o instanceof AlloyPaper.Stage) {
	//            var list = o.children.slice(0);
	//            for (var i = 0, l = list.length; i < l; i++) {
	//                ctx.save();
	//                this.render(ctx, list[i]);
	//                ctx.restore();
	//            }
	//        } else if (o instanceof AlloyPaper.Bitmap || o instanceof AlloyPaper.Sprite) {
	//            var rect = o.rect;
	//            ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
	//        } else if (o.txtCanvas) {
	//            ctx.drawImage(o.txtCanvas, 0, 0);
	//        } else if (o.shapeCanvas) {
	//            ctx.drawImage(o.shapeCanvas, 0, 0);
	//        }
	//    },
	//    "onClick": function(fn) {
	//        this.on("click", fn);
	//    },
	//    "onMouseDown": function(fn) {
	//        this.on("pressdown", fn);
	//    },
	//    "onMouseMove": function(fn) {
	//        this.on("mousemove", fn);
	//    },
	//    "onMouseUp": function(fn) {
	//        this.on("pressup", fn);
	//    },
	//    "onMouseOver": function(fn) {
	//        this.on("mouseover", fn);
	//    },
	//    "onMouseOut": function(fn) {
	//        this.on("mouseout", fn);
	//    },
	//    "onHover": function(over, out) {
	//        this.on("mouseover", over);
	//        this.on("mouseout", out);
	//    },
	//    "onPressDown": function(fn) {
	//        this.on("pressdown", fn);
	//    },
	//    "onPressMove": function(fn) {
	//        this.on("pressmove", fn);
	//    },
	//    "onPressUp": function(fn) {
	//        this.on("pressup", fn);
	//    },
	//    "onMouseWheel": function(fn) {
	//        this.on("mousewheel", fn);
	//    },
	//    "onTouchStart": function(fn) {
	//        this.on("pressdown", fn);
	//    },
	//    "onTouchMove": function(fn) {
	//        this.on("pressmove", fn);
	//    },
	//    "onTouchEnd": function(fn) {
	//        this.on("pressup", fn);
	//    },
	//    "onTouchCancel": function () {
	//        this.on("touchcancel", fn);
	//    },
	//    "onDbClick": function(fn) {
	//        this.on("dblclick", fn);
	//    },
	//    "addEventListener": function (type, handler) {
	//        this.on(this._normalizeEventType(type), handler);
	//    },
	//    "removeEventListener": function (type, handler) {
	//        this.off(this._normalizeEventType(type), handler);
	//    },
	//    "_normalizeEventType": function (type) {
	//        var newType = { "touchstart": "pressdown", "touchmove": "pressmove", "touchend": "pressup" }[type];
	//        if (newType) return newType;
	//        return type;
	//    }
	//});

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
	}(_display_object2['default']);

	exports['default'] = Container;

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Stage = function (_Container) {
	    _inherits(Stage, _Container);

	    function Stage(width, height, renderTo) {
	        _classCallCheck(this, Stage);

	        var _this = _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this));

	        _this.renderTo = typeof renderTo === "string" ? document.querySelector(renderTo) : renderTo;
	        _this.canvas = document.createElement('canvas');
	        _this.canvas.width = width;
	        _this.canvas.height = height;
	        _this.renderTo.appendChild(_this.canvas);
	        _this.renderer = new _canvas_render2['default'](_this.canvas);
	        return _this;
	    }

	    _createClass(Stage, [{
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
	}(_container2['default']);

	exports['default'] = Stage;

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
	            if (obj instanceof _graphics2['default']) {
	                this.renderGraphics(obj);
	            } else if (obj instanceof _container2['default']) {}
	            this.ctx.restore();
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this.ctx.clearRect(0, 0, this.width, this.height);
	        }
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
	}(_render2['default']);

	exports['default'] = CanvasRender;

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
	}(_display_object2["default"]);

	exports["default"] = Graphics;

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

	exports["default"] = Render;

/***/ }
/******/ ]);