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

	var _bezierCurveShape = __webpack_require__(17);

	var _bezierCurveShape2 = _interopRequireDefault(_bezierCurveShape);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var stage = new _index.Stage(480, 480, "body"),
	    _boundingClientRect = stage.canvas.getBoundingClientRect(),
	    startX = void 0,
	    startY = void 0,
	    isMouseDown = false,
	    posDiv = document.getElementById('pos'),
	    shape = new _bezierCurveShape2.default();

	stage.add(shape);

	//������stage.addEventListener,��Ϊstage.addEventListener��Ҫ��̨�ж������ܴ���ð�ݻ��߲���

	stage.canvas.addEventListener('mousedown', function (evt) {
	    _boundingClientRect = stage.canvas.getBoundingClientRect();
	    startX = evt.clientX - _boundingClientRect.left - stage.borderLeftWidth;
	    startY = evt.clientY - _boundingClientRect.top - stage.borderTopWidth;

	    if (shape.points.length > 2 && (startX - shape.points[0]) * (startX - shape.points[0]) + (startY - shape.points[1]) * (startY - shape.points[1]) < 100) {
	        shape.closePath();
	    } else {
	        shape.addCircle(startX, startY);
	        isMouseDown = true;
	    }

	    stage.update();
	});

	stage.canvas.addEventListener('mousemove', function (evt) {
	    var currentX = evt.clientX - _boundingClientRect.left - stage.borderLeftWidth;
	    var currentY = evt.clientY - _boundingClientRect.top - stage.borderTopWidth;
	    if (isMouseDown) {
	        if (!shape.willAdjust) {
	            shape.virtualCurve.visible = false;
	            shape.updateControlPoints(startX, startY, currentX, currentY);
	        }
	    } else if (!shape.closed) {
	        shape.virtualCurve.visible = true;
	        shape.renderVirtualCurve(currentX, currentY);
	    }
	    stage.update();
	    evt.preventDefault();
	    posDiv.innerHTML = currentX + '_' + currentY;
	});

	document.addEventListener('mouseup', function (evt) {
	    isMouseDown = false;
	    shape.bindCircleEvent();
	});

	setInterval(function () {
	    stage.update();
	}, 16);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _matrix2d = __webpack_require__(2);

	var _matrix2d2 = _interopRequireDefault(_matrix2d);

	var _display_object = __webpack_require__(3);

	var _display_object2 = _interopRequireDefault(_display_object);

	var _group = __webpack_require__(6);

	var _group2 = _interopRequireDefault(_group);

	var _stage = __webpack_require__(7);

	var _stage2 = _interopRequireDefault(_stage);

	var _graphics = __webpack_require__(10);

	var _graphics2 = _interopRequireDefault(_graphics);

	var _path = __webpack_require__(12);

	var _path2 = _interopRequireDefault(_path);

	var _circle = __webpack_require__(14);

	var _circle2 = _interopRequireDefault(_circle);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AlloyRender = {};

	AlloyRender.Matrix2D = _matrix2d2.default;
	AlloyRender.Stage = _stage2.default;
	AlloyRender.DisplayObject = _display_object2.default;
	AlloyRender.Group = _group2.default;
	AlloyRender.Graphics = _graphics2.default;
	AlloyRender.Path = _path2.default;
	AlloyRender.Circle = _circle2.default;

	window.AlloyRender = AlloyRender;
	module.exports = AlloyRender;

/***/ },
/* 2 */
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
	        value: function appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, originX, originY) {
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
	            if (originX || originY) {
	                this.tx -= originX * this.a + originY * this.c;
	                this.ty -= originX * this.b + originY * this.d;
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _matrix2d = __webpack_require__(2);

	var _matrix2d2 = _interopRequireDefault(_matrix2d);

	var _event_dispatcher = __webpack_require__(4);

	var _event_dispatcher2 = _interopRequireDefault(_event_dispatcher);

	var _uid = __webpack_require__(5);

	var _uid2 = _interopRequireDefault(_uid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DisplayObject = function (_EventDispatcher) {
	    _inherits(DisplayObject, _EventDispatcher);

	    function DisplayObject() {
	        _classCallCheck(this, DisplayObject);

	        var _this = _possibleConstructorReturn(this, (DisplayObject.__proto__ || Object.getPrototypeOf(DisplayObject)).call(this));

	        _this.alpha = _this.complexAlpha = _this.scaleX = _this.scaleY = 1;
	        _this.x = _this.y = _this.rotation = _this.skewX = _this.skewY = _this.originX = _this.originY = 0;
	        _this.cursor = "default";
	        _this.visible = true;
	        _this._matrix = new _matrix2d2.default();
	        _this._hitMatrix = new _matrix2d2.default();
	        _this.id = _uid2.default.get();
	        return _this;
	    }

	    _createClass(DisplayObject, [{
	        key: 'isVisible',
	        value: function isVisible() {
	            return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0;
	        }
	    }]);

	    return DisplayObject;
	}(_event_dispatcher2.default);

	exports.default = DisplayObject;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MOUSEOUT = 'mouseout';

	var EventDispatcher = function () {
	    function EventDispatcher() {
	        _classCallCheck(this, EventDispatcher);

	        this._listeners = null;
	        this._captureListeners = null;
	    }

	    _createClass(EventDispatcher, [{
	        key: 'addEventListener',
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
	        key: 'removeEventListener',
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
	        key: 'dispatchEvent',
	        value: function dispatchEvent(evt) {

	            if (evt.type === MOUSEOUT || !this.parent) {
	                this._dispatchEvent(evt, 0);
	                this._dispatchEvent(evt, 1);
	            } else {

	                var top = this,
	                    list = [top];
	                while (top.parent) {
	                    list.push(top = top.parent);
	                }
	                var i,
	                    l = list.length;

	                // capture & atTarget
	                for (i = l - 1; i >= 0 && !evt.propagationStopped; i--) {

	                    list[i]._dispatchEvent(evt, 0);
	                }
	                // bubbling
	                for (i = 0; i < l && !evt.propagationStopped; i++) {
	                    list[i]._dispatchEvent(evt, 1);
	                }
	            }
	        }
	    }, {
	        key: '_dispatchEvent',
	        value: function _dispatchEvent(evt, type) {
	            var _this = this;

	            if (this._captureListeners && type === 0) {
	                var cls = this._captureListeners[evt.type];
	                cls && cls.forEach(function (fn) {
	                    fn.call(_this, evt);
	                });
	            }

	            if (this._listeners && type === 1) {
	                var ls = this._listeners[evt.type];
	                ls && ls.forEach(function (fn) {
	                    fn.call(_this, evt);
	                });
	            }
	        }
	    }]);

	    return EventDispatcher;
	}();

	exports.default = EventDispatcher;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var UID = {};

	UID._nextID = 0;

	UID.get = function () {
	    return UID._nextID++;
	};

	exports.default = UID;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _display_object = __webpack_require__(3);

	var _display_object2 = _interopRequireDefault(_display_object);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Group = function (_DisplayObject) {
	    _inherits(Group, _DisplayObject);

	    function Group(data) {
	        _classCallCheck(this, Group);

	        var _this = _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this, data));

	        _this.children = [];
	        return _this;
	    }

	    _createClass(Group, [{
	        key: 'add',
	        value: function add(child) {

	            var len = arguments.length;

	            for (var i = 0; i < len; i++) {

	                this.children.push(arguments[i]);
	                arguments[i].parent = this;
	            }
	        }
	    }, {
	        key: 'remove',
	        value: function remove(child) {
	            var len = arguments.length;
	            var cLen = this.children.length;

	            for (var i = 0; i < len; i++) {

	                for (var j = 0; j < cLen; j++) {

	                    if (child.id == this.children[j].id) {
	                        child.parent = null;
	                        this.children.splice(j, 1);
	                        j--;
	                        cLen--;
	                    }
	                }
	            }
	        }
	    }]);

	    return Group;
	}(_display_object2.default);

	exports.default = Group;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _group = __webpack_require__(6);

	var _group2 = _interopRequireDefault(_group);

	var _renderer = __webpack_require__(8);

	var _renderer2 = _interopRequireDefault(_renderer);

	var _hit_render = __webpack_require__(15);

	var _hit_render2 = _interopRequireDefault(_hit_render);

	var _event = __webpack_require__(16);

	var _event2 = _interopRequireDefault(_event);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Stage = function (_Group) {
	    _inherits(Stage, _Group);

	    function Stage(width, height, renderTo) {
	        _classCallCheck(this, Stage);

	        var _this = _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this));

	        _this.renderTo = typeof renderTo === 'string' ? document.querySelector(renderTo) : renderTo;

	        _this.canvas = document.createElement('canvas');
	        _this.canvas.width = width;
	        _this.canvas.height = height;
	        _this.renderTo.appendChild(_this.canvas);
	        _this.renderer = new _renderer2.default(_this.canvas);

	        _this.canvas.addEventListener('click', function (evt) {
	            return _this._handleClick(evt);
	        });

	        _this.canvas.addEventListener("mousemove", function (evt) {
	            return _this._handleMouseMove(evt);
	        });

	        _this.canvas.addEventListener("mousedown", function (evt) {
	            return _this._handleMouseDown(evt);
	        });

	        _this.canvas.addEventListener("mouseup", function (evt) {
	            return _this._handleMouseUp(evt);
	        });

	        _this.canvas.addEventListener("mouseout", function (evt) {
	            return _this._handleMouseOut(evt);
	        });
	        //this.canvas.addEventListener("click", this._handleClick.bind(this), false);

	        _this.canvas.addEventListener("dblclick", function (evt) {
	            return _this._handlDblClick(evt);
	        });
	        //this.addEvent(this.canvas, "mousewheel", this._handleMouseWheel.bind(this));
	        //this.canvas.addEventListener("touchmove", this._handleMouseMove.bind(this), false);
	        //this.canvas.addEventListener("touchstart", this._handleMouseDown.bind(this), false);
	        //this.canvas.addEventListener("touchend", this._handleMouseUp.bind(this), false);
	        //this.canvas.addEventListener("touchcancel", this._handleTouchCancel.bind(this), false);

	        _this.borderTopWidth = 0;
	        _this.borderLeftWidth = 0;

	        _this.hitAABB = false;
	        _this._hitRender = new _hit_render2.default();
	        //get rect again when trigger onscroll onresize event!?
	        _this._boundingClientRect = _this.canvas.getBoundingClientRect();
	        _this._overObject = null;

	        return _this;
	    }

	    _createClass(Stage, [{
	        key: '_handlDblClick',
	        value: function _handlDblClick(evt) {
	            var obj = this._getObjectUnderPoint(evt);
	        }
	    }, {
	        key: '_handleClick',
	        value: function _handleClick(evt) {
	            //this._computeStageXY(evt)
	            var obj = this._getObjectUnderPoint(evt);
	        }
	    }, {
	        key: '_handleMouseDown',
	        value: function _handleMouseDown(evt) {
	            var obj = this._getObjectUnderPoint(evt);
	        }
	    }, {
	        key: '_handleMouseUp',
	        value: function _handleMouseUp(evt) {
	            var obj = this._getObjectUnderPoint(evt);
	        }
	    }, {
	        key: '_handleMouseOut',
	        value: function _handleMouseOut(evt) {
	            this._computeStageXY(evt);
	            this.dispatchEvent(_defineProperty({
	                pureEvent: evt,
	                type: 'mouseout',
	                stageX: evt.stageX,
	                stageY: evt.stageY
	            }, 'pureEvent', evt));

	            //this._overObject&& this._overObject.dispatchEvent({
	            //    pureEvent: evt,
	            //        type: 'mouseout',
	            //        stageX: evt.stageX,
	            //        stageY: evt.stageY,
	            //        pureEvent: evt
	            //})
	        }
	    }, {
	        key: '_handleMouseMove',
	        value: function _handleMouseMove(evt) {

	            var obj = this._getObjectUnderPoint(evt);
	            var mockEvt = new _event2.default();
	            mockEvt.stageX = evt.stageX;
	            mockEvt.stageY = evt.stageY;
	            mockEvt.pureEvent = evt;

	            if (obj) {
	                if (this._overObject === null) {
	                    mockEvt.type = 'mouseover';
	                    obj.dispatchEvent(mockEvt);
	                    this._overObject = obj;
	                    this._setCursor(obj.cursor);
	                } else {
	                    if (obj.id !== this._overObject.id) {
	                        mockEvt.type = 'mouseover';
	                        obj.dispatchEvent(mockEvt);
	                        this._setCursor(obj.cursor);
	                        this._overObject.dispatchEvent(_defineProperty({
	                            pureEvent: evt,
	                            type: 'mouseout',
	                            stageX: evt.stageX,
	                            stageY: evt.stageY
	                        }, 'pureEvent', evt));
	                        this._overObject = obj;
	                    } else {
	                        mockEvt.type = 'mousemove';
	                        obj.dispatchEvent(mockEvt);
	                    }
	                }
	            } else if (this._overObject) {

	                mockEvt.type = 'mouseout';
	                this._overObject.dispatchEvent(mockEvt);
	                this._overObject = null;
	                this._setCursor(this.cursor);
	            }
	        }
	    }, {
	        key: '_setCursor',
	        value: function _setCursor(cursor) {
	            this.canvas.style.cursor = cursor;
	        }
	    }, {
	        key: '_getObjectUnderPoint',
	        value: function _getObjectUnderPoint(evt) {
	            this._computeStageXY(evt);
	            if (this.hitAABB) {
	                return this._hitRender.hitAABB(this, evt);
	            } else {
	                return this._hitRender.hitPixel(this, evt);
	            }
	        }
	    }, {
	        key: '_computeStageXY',
	        value: function _computeStageXY(evt) {
	            this._boundingClientRect = this.canvas.getBoundingClientRect();
	            evt.stageX = evt.clientX - this._boundingClientRect.left - this.borderLeftWidth;
	            evt.stageY = evt.clientY - this._boundingClientRect.top - this.borderTopWidth;
	        }
	    }, {
	        key: 'update',
	        value: function update() {
	            this.renderer.update(this);
	            //this.renderer.clear()
	            //this.children.forEach( child => {
	            //    this.renderer.render(child)
	            //})
	        }
	    }]);

	    return Stage;
	}(_group2.default);

	exports.default = Stage;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _canvas_render = __webpack_require__(9);

	var _canvas_render2 = _interopRequireDefault(_canvas_render);

	var _group = __webpack_require__(6);

	var _group2 = _interopRequireDefault(_group);

	var _graphics = __webpack_require__(10);

	var _graphics2 = _interopRequireDefault(_graphics);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Renderer = function () {
	    function Renderer(canvas) {
	        _classCallCheck(this, Renderer);

	        this.renderer = new _canvas_render2.default(canvas);
	        this.renderList = [];
	        this.mainCtx = this.renderer.ctx;
	    }

	    _createClass(Renderer, [{
	        key: 'update',
	        value: function update(stage) {
	            var objs = this.renderList,
	                engine = this.renderer;
	            objs.length = 0;
	            this.computeMatrix(stage);
	            engine.clear();
	            objs.forEach(function (obj) {
	                engine.render(obj);
	            });
	        }
	    }, {
	        key: 'computeMatrix',
	        value: function computeMatrix(stage) {
	            for (var i = 0, len = stage.children.length; i < len; i++) {
	                this._computeMatrix(stage.children[i]);
	            }
	        }
	    }, {
	        key: 'initComplex',
	        value: function initComplex(o) {
	            o.complexCompositeOperation = this._getCompositeOperation(o);
	            o.complexAlpha = this._getAlpha(o, 1);
	        }
	    }, {
	        key: '_computeMatrix',
	        value: function _computeMatrix(o, mtx) {
	            if (!o.isVisible()) {
	                return;
	            }
	            if (mtx) {
	                o._matrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	            } else {
	                o._matrix.initialize(1, 0, 0, 1, 0, 0);
	            }

	            o._matrix.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.originX, o.originY);

	            if (o instanceof _group2.default) {
	                var list = o.children,
	                    len = list.length,
	                    i = 0;
	                for (; i < len; i++) {
	                    this._computeMatrix(list[i], o._matrix);
	                }
	            } else {
	                if (o instanceof _graphics2.default) {
	                    this.renderList.push(o);
	                    this.initComplex(o);
	                } else {
	                    // o.initAABB();
	                    //if (this.isInStage(o)) {
	                    this.renderList.push(o);
	                    this.initComplex(o);
	                    //}
	                }
	            }
	        }
	    }, {
	        key: '_getCompositeOperation',
	        value: function _getCompositeOperation(o) {
	            if (o.compositeOperation) return o.compositeOperation;
	            if (o.parent) return this._getCompositeOperation(o.parent);
	        }
	    }, {
	        key: '_getAlpha',
	        value: function _getAlpha(o, alpha) {
	            var result = o.alpha * alpha;
	            if (o.parent) {
	                return this._getAlpha(o.parent, result);
	            }
	            return result;
	        }
	    }, {
	        key: 'isInStage',
	        value: function isInStage(o) {
	            return this.collisionBetweenAABB(o.AABB, this.stage.AABB);
	        }
	    }, {
	        key: 'collisionBetweenAABB',
	        value: function collisionBetweenAABB(AABB1, AABB2) {
	            var maxX = AABB1[0] + AABB1[2];
	            if (maxX < AABB2[0]) return false;
	            var minX = AABB1[0];
	            if (minX > AABB2[0] + AABB2[2]) return false;
	            var maxY = AABB1[1] + AABB1[3];
	            if (maxY < AABB2[1]) return false;
	            var minY = AABB1[1];
	            if (minY > AABB2[1] + AABB2[3]) return false;
	            return true;
	        }
	    }]);

	    return Renderer;
	}();

	exports.default = Renderer;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _group = __webpack_require__(6);

	var _group2 = _interopRequireDefault(_group);

	var _graphics = __webpack_require__(10);

	var _graphics2 = _interopRequireDefault(_graphics);

	var _render = __webpack_require__(11);

	var _render2 = _interopRequireDefault(_render);

	var _path = __webpack_require__(12);

	var _path2 = _interopRequireDefault(_path);

	var _circle = __webpack_require__(14);

	var _circle2 = _interopRequireDefault(_circle);

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
	            this.ctx.globalAlpha = obj.complexAlpha;
	            this.ctx.transform(obj._matrix.a, obj._matrix.b, obj._matrix.c, obj._matrix.d, obj._matrix.tx, obj._matrix.ty);
	            if (obj instanceof _graphics2.default) {
	                this.renderGraphics(obj);
	            } else if (obj instanceof _path2.default || obj instanceof _circle2.default) {
	                obj.draw(this.ctx);
	            }
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _display_object = __webpack_require__(3);

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
	            this.beginPath();
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
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _display_object = __webpack_require__(3);

	var _display_object2 = _interopRequireDefault(_display_object);

	var _pathParser = __webpack_require__(13);

	var _pathParser2 = _interopRequireDefault(_pathParser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Path = function (_DisplayObject) {
	    _inherits(Path, _DisplayObject);

	    function Path(d, option) {
	        _classCallCheck(this, Path);

	        var _this = _possibleConstructorReturn(this, (Path.__proto__ || Object.getPrototypeOf(Path)).call(this));

	        _this.type = 'path';
	        _this.d = d;
	        _this.fill = 'black';
	        _this.stroke = 'black';
	        _this.strokeWidth = 1;

	        option && Object.keys(option).forEach(function (key) {
	            _this[key] = option[key];
	        });

	        // this.element.setAttribute('d', d)
	        return _this;
	    }

	    _createClass(Path, [{
	        key: 'draw',
	        value: function draw(ctx) {

	            var cmds = (0, _pathParser2.default)(this.d);
	            ctx.save();

	            ctx.lineWidth = this.strokeWidth;
	            ctx.strokeStyle = this.stroke;
	            ctx.fillStyle = this.fill;
	            ctx.beginPath();
	            //https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
	            //M = moveto
	            //L = lineto
	            //H = horizontal lineto
	            //V = vertical lineto
	            //C = curveto
	            //S = smooth curveto
	            //Q = quadratic Belzier curve
	            //T = smooth quadratic Belzier curveto
	            //A = elliptical Arc  暂时未实现，用贝塞尔拟合椭圆
	            //Z = closepath
	            //以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位(从上一个点开始)。
	            var preX = void 0,
	                preY = void 0;

	            for (var j = 0, cmdLen = cmds.length; j < cmdLen; j++) {
	                var item = cmds[j];
	                var action = item[0];
	                var preItem = cmds[j - 1];

	                switch (action) {
	                    case 'M':
	                        preX = item[1];
	                        preY = item[2];
	                        ctx.moveTo(preX, preY);
	                        break;
	                    case 'L':
	                        preX = item[1];
	                        preY = item[2];
	                        ctx.lineTo(preX, preY);
	                        break;
	                    case 'H':
	                        preY = item[1];
	                        ctx.lineTo(preX, item[1]);
	                        break;
	                    case 'V':
	                        preX = item[1];
	                        ctx.lineTo(item[1], preY);
	                        break;
	                    case 'C':
	                        preX = item[5];
	                        preY = item[6];
	                        ctx.bezierCurveTo(item[1], item[2], item[3], item[4], preX, preY);
	                        break;
	                    case 'S':
	                        ctx.bezierCurveTo(preX + preX - preItem[3], preY + preY - preItem[4], item[1], item[2], item[3], item[4]);
	                        preX = item[3];
	                        preY = item[4];
	                        break;
	                    case 'Q':
	                        preX = item[3];
	                        preY = item[4];
	                        ctx.quadraticCurveTo(item[1], item[2], preX, preY);
	                        break;
	                    case 'T':
	                        ctx.quadraticCurveTo(preX + preX - preItem[1], preY + preY - preItem[2], item[1], item[2]);
	                        preX = item[1];
	                        preY = item[2];
	                        break;

	                    case 'm':
	                        preX += item[1];
	                        preY += item[2];
	                        ctx.moveTo(preX, preY);
	                        break;
	                    case 'l':
	                        preX += item[1];
	                        preY += item[2];
	                        ctx.lineTo(item[1], item[2]);
	                        break;
	                    case 'h':
	                        preY += item[1];
	                        ctx.lineTo(preX, preY);
	                        break;
	                    case 'v':
	                        preX += item[1];
	                        ctx.lineTo(item[1], preY);
	                        break;
	                    case 'c':
	                        ctx.bezierCurveTo(preX + item[1], preY + item[2], preX + item[3], preY + item[4], preX + item[5], preY + item[6]);
	                        preX = preX + item[5];
	                        preY = preY + item[6];
	                        break;
	                    case 's':
	                        ctx.bezierCurveTo(preX + preX + preX - preItem[3], preY + preY + preY - preItem[4], preX + item[1], preY + item[2], preX + item[3], preY + item[4]);
	                        preX += item[3];
	                        preY += item[4];
	                        break;
	                    case 'q':

	                        ctx.quadraticCurveTo(preX + item[1], preY + item[2], item[3] + preX, item[4] + preY);
	                        preX += item[3];
	                        preY += item[4];
	                        break;
	                    case 't':

	                        ctx.quadraticCurveTo(preX + preX + preX - preItem[1], preY + preY + preY - preItem[2], preX + item[1], preY + item[2]);
	                        preX += item[1];
	                        preY += item[2];
	                        break;

	                    case 'Z':
	                        ctx.closePath();
	                        break;
	                }
	            }

	            ctx.fill();
	            ctx.stroke();
	            ctx.restore();
	        }
	    }]);

	    return Path;
	}(_display_object2.default);

	exports.default = Path;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	//https://github.com/jkroso/parse-svg-path/blob/master/index.js
	/**
	 * expected argument lengths
	 * @type {Object}
	 */

	var length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };

	/**
	 * segment pattern
	 * @type {RegExp}
	 */

	var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;

	/**
	 * parse an svg path data string. Generates an Array
	 * of commands where each command is an Array of the
	 * form `[command, arg1, arg2, ...]`
	 *
	 * @param {String} path
	 * @return {Array}
	 */

	function parse(path) {
	    var data = [];
	    path.replace(segment, function (_, command, args) {
	        var type = command.toLowerCase();
	        args = parseValues(args);

	        // overloaded moveTo
	        if (type == 'm' && args.length > 2) {
	            data.push([command].concat(args.splice(0, 2)));
	            type = 'l';
	            command = command == 'm' ? 'l' : 'L';
	        }

	        while (true) {
	            if (args.length == length[type]) {
	                args.unshift(command);
	                return data.push(args);
	            }
	            if (args.length < length[type]) throw new Error('malformed path data');
	            data.push([command].concat(args.splice(0, length[type])));
	        }
	    });
	    return data;
	}

	var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;

	function parseValues(args) {
	    var numbers = args.match(number);
	    return numbers ? numbers.map(Number) : [];
	}

	exports.default = parse;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _display_object = __webpack_require__(3);

	var _display_object2 = _interopRequireDefault(_display_object);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Circle = function (_DisplayObject) {
	    _inherits(Circle, _DisplayObject);

	    function Circle(r) {
	        _classCallCheck(this, Circle);

	        var _this = _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this));

	        _this.r = r;
	        // this.element.setAttribute('d', d)
	        _this._dp = Math.PI * 2;
	        return _this;
	    }

	    _createClass(Circle, [{
	        key: 'draw',
	        value: function draw(ctx) {

	            ctx.beginPath();
	            ctx.arc(0, 0, this.r, 0, this._dp, false);

	            ctx.stroke();

	            ctx.beginPath();
	            ctx.fillStyle = 'white';
	            ctx.arc(0, 0, this.r - 1, 0, this._dp, false);

	            ctx.fill();
	        }
	    }]);

	    return Circle;
	}(_display_object2.default);

	exports.default = Circle;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _group = __webpack_require__(6);

	var _group2 = _interopRequireDefault(_group);

	var _graphics = __webpack_require__(10);

	var _graphics2 = _interopRequireDefault(_graphics);

	var _render = __webpack_require__(11);

	var _render2 = _interopRequireDefault(_render);

	var _event = __webpack_require__(16);

	var _event2 = _interopRequireDefault(_event);

	var _path = __webpack_require__(12);

	var _path2 = _interopRequireDefault(_path);

	var _circle = __webpack_require__(14);

	var _circle2 = _interopRequireDefault(_circle);

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
	        //debug event
	        //this.canvas.width = 441
	        //this.canvas.height = 441
	        //document.body.appendChild(this.canvas)
	        return _this;
	    }

	    _createClass(HitRender, [{
	        key: 'clear',
	        value: function clear() {
	            this.ctx.clearRect(0, 0, this.width, this.height);
	        }
	    }, {
	        key: 'hitAABB',
	        value: function hitAABB(root, evt) {}
	    }, {
	        key: 'hitPixel',
	        value: function hitPixel(o, evt) {
	            var ctx = this.ctx;
	            var mtx = o._hitMatrix;
	            var list = o.children.slice(0),
	                l = list.length;
	            for (var i = l - 1; i >= 0; i--) {
	                var child = list[i];
	                mtx.initialize(1, 0, 0, 1, 0, 0);
	                mtx.appendTransform(o.x - evt.stageX, o.y - evt.stageY, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.originX, o.originY);
	                if (!this.checkBoundEvent(child)) continue;
	                ctx.save();
	                var target = this._hitPixel(child, evt, mtx);
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
	            if (!o.isVisible()) return;
	            var ctx = this.ctx;
	            ctx.clearRect(0, 0, 2, 2);
	            if (mtx) {
	                o._hitMatrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	            } else {
	                o._hitMatrix.initialize(1, 0, 0, 1, 0, 0);
	            }
	            mtx = o._hitMatrix;
	            mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.originX, o.originY);
	            if (o instanceof _graphics2.default) {
	                ctx.globalAlpha = o.complexAlpha;
	                ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	                this.renderGraphics(o);
	            } else if (o instanceof _path2.default || o instanceof _circle2.default) {
	                ctx.globalAlpha = o.complexAlpha;
	                ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	                o.draw(ctx);
	            } else if (o instanceof _group2.default) {
	                var list = o.children.slice(0),
	                    l = list.length;
	                for (var i = l - 1; i >= 0; i--) {
	                    ctx.save();
	                    var target = this._hitPixel(list[i], evt, mtx);
	                    if (target) return target;
	                    ctx.restore();
	                }
	            }

	            if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
	                this._dispatchEvent(o, evt);
	                return o;
	            }
	        }
	    }, {
	        key: '_dispatchEvent',
	        value: function _dispatchEvent(obj, evt) {
	            var mockEvt = new _event2.default();
	            mockEvt.stageX = evt.stageX;
	            mockEvt.stageY = evt.stageY;
	            mockEvt.pureEvent = evt;
	            mockEvt.type = evt.type;
	            obj.dispatchEvent(mockEvt);
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

	    return HitRender;
	}(_render2.default);

	exports.default = HitRender;

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Event = function () {
	    function Event() {
	        _classCallCheck(this, Event);

	        this.propagationStopped = false;
	        this.stageX = null;
	        this.stageY = null;
	        this.pureEvent = null;
	    }

	    _createClass(Event, [{
	        key: "stopPropagation",
	        value: function stopPropagation() {
	            this.propagationStopped = true;
	        }
	    }]);

	    return Event;
	}();

	exports.default = Event;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(1);

	var _arDrag = __webpack_require__(18);

	var _arDrag2 = _interopRequireDefault(_arDrag);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BezierCurveShape = function (_Group) {
	    _inherits(BezierCurveShape, _Group);

	    function BezierCurveShape() {
	        _classCallCheck(this, BezierCurveShape);

	        var _this = _possibleConstructorReturn(this, (BezierCurveShape.__proto__ || Object.getPrototypeOf(BezierCurveShape)).call(this));

	        _this.points = [];
	        _this.controlPoints = [];

	        _this.controlLines = new _index.Graphics();
	        _this.curve = new _index.Graphics();
	        _this.virtualCurve = new _index.Graphics();
	        _this.virtualCurve.alpha = 0.5;

	        _this.closed = false;
	        _this.index = 0;
	        _this.circleGroup = new _index.Group();
	        _this.ctrlCircleGroup = new _index.Group();
	        _this.add(_this.curve, _this.controlLines, _this.virtualCurve, _this.ctrlCircleGroup, _this.circleGroup);

	        _this.willAdjust = false;

	        _this.curve.addEventListener('click', function (evt) {
	            _this.toggle();
	        });

	        (0, _arDrag2.default)(_this.curve, {
	            move: function move(evt) {
	                //this.curve.x += evt.dx
	                //this.curve.y += evt.dy

	                _this.updatePoints(evt.dx, evt.dy);
	                _this.draw();
	            },
	            down: function down() {
	                _this.willAdjust = true;
	            },
	            up: function up() {
	                _this.willAdjust = false;
	            }

	        });

	        _this.isEditing = false;
	        return _this;
	    }

	    _createClass(BezierCurveShape, [{
	        key: 'updatePoints',
	        value: function updatePoints(dx, dy) {
	            var _this2 = this;

	            this.points.forEach(function (item, index) {
	                if (index % 2 === 0) {
	                    _this2.points[index] += dx;
	                    _this2.points[index + 1] += dy;
	                }
	            });

	            this.controlPoints.forEach(function (item, index) {
	                if (index % 2 === 0) {
	                    _this2.controlPoints[index] += dx;
	                    _this2.controlPoints[index + 1] += dy;
	                }
	            });

	            this.ctrlCircleGroup.children.forEach(function (item) {
	                item.x += dx;
	                item.y += dy;
	            });

	            this.circleGroup.children.forEach(function (item) {
	                item.x += dx;
	                item.y += dy;
	            });
	        }
	    }, {
	        key: 'toggle',
	        value: function toggle() {
	            if (this.isEditing) {
	                this.controlLines.visible = true;
	                this.ctrlCircleGroup.visible = true;
	                this.circleGroup.visible = true;
	            } else {
	                this.controlLines.visible = false;
	                this.ctrlCircleGroup.visible = false;
	                this.circleGroup.visible = false;
	            }
	            this.isEditing = !this.isEditing;
	        }
	    }, {
	        key: 'updateControlPoints',
	        value: function updateControlPoints(startX, startY, currentX, currentY) {
	            if (this.closed) return;
	            this.controlPoints[this.index] = startX + startX - currentX;
	            this.controlPoints[this.index + 1] = startY + startY - currentY;
	            this.controlPoints[this.index + 2] = currentX;
	            this.controlPoints[this.index + 3] = currentY;
	            this.draw();
	        }
	    }, {
	        key: 'addCircle',
	        value: function addCircle(x, y) {
	            if (this.closed || this.willAdjust) return;
	            var c = new _index.Circle(5);
	            c.cursor = 'move';
	            var cc1 = new _index.Circle(4);
	            var cc2 = new _index.Circle(4);
	            this.points.push(x, y);
	            this.index = this.controlPoints.length;
	            c.x = x;
	            c.y = y;
	            cc1.x = x;
	            cc1.y = y;
	            cc2.x = x;
	            cc2.y = y;
	            cc1.cursor = 'move';
	            cc2.cursor = 'move';
	            this.circleGroup.add(c);
	            this.ctrlCircleGroup.add(cc1, cc2);
	        }
	    }, {
	        key: 'bindCircleEvent',
	        value: function bindCircleEvent() {
	            var _this3 = this;

	            var c = this.circleGroup.children[this.circleGroup.children.length - 1];
	            var cc1 = this.ctrlCircleGroup.children[this.ctrlCircleGroup.children.length - 2];
	            var cc2 = this.ctrlCircleGroup.children[this.ctrlCircleGroup.children.length - 1];
	            (0, _arDrag2.default)(c, {
	                move: function move(evt) {
	                    c.x += evt.dx;
	                    c.y += evt.dy;

	                    var index = _this3.circleGroup.children.indexOf(c);

	                    _this3.ctrlCircleGroup.children[index * 2].x += evt.dx;
	                    _this3.ctrlCircleGroup.children[index * 2].y += evt.dy;
	                    _this3.ctrlCircleGroup.children[index * 2 + 1].x += evt.dx;
	                    _this3.ctrlCircleGroup.children[index * 2 + 1].y += evt.dy;
	                    _this3.points[index * 2] += evt.dx;
	                    _this3.points[index * 2 + 1] += evt.dy;

	                    _this3.controlPoints[index * 4] += evt.dx;
	                    _this3.controlPoints[index * 4 + 1] += evt.dy;
	                    _this3.controlPoints[index * 4 + 2] += evt.dx;
	                    _this3.controlPoints[index * 4 + 3] += evt.dy;

	                    if (_this3.closed && index === 0) {
	                        _this3.points[_this3.points.length - 2] += evt.dx;
	                        _this3.points[_this3.points.length - 1] += evt.dy;
	                    }
	                    _this3.draw();
	                },
	                down: function down() {
	                    _this3.willAdjust = true;
	                },
	                up: function up() {
	                    _this3.willAdjust = false;
	                }

	            });

	            (0, _arDrag2.default)([cc1, cc2], {
	                move: function move(evt) {
	                    evt.target.x += evt.dx;
	                    evt.target.y += evt.dy;

	                    var index = _this3.ctrlCircleGroup.children.indexOf(evt.target);

	                    if (index % 2 === 0) {
	                        _this3.controlPoints[index * 2] += evt.dx;
	                        _this3.controlPoints[index * 2 + 1] += evt.dy;
	                        _this3.controlPoints[index * 2 + 2] -= evt.dx;
	                        _this3.controlPoints[index * 2 + 3] -= evt.dy;

	                        _this3.ctrlCircleGroup.children[index].x += evt.dx;
	                        _this3.ctrlCircleGroup.children[index].y += evt.dy;
	                        _this3.ctrlCircleGroup.children[index + 1].x -= evt.dx;
	                        _this3.ctrlCircleGroup.children[index + 1].y -= evt.dy;
	                    } else {
	                        index--;
	                        _this3.controlPoints[index * 2] -= evt.dx;
	                        _this3.controlPoints[index * 2 + 1] -= evt.dy;
	                        _this3.controlPoints[index * 2 + 2] += evt.dx;
	                        _this3.controlPoints[index * 2 + 3] += evt.dy;

	                        _this3.ctrlCircleGroup.children[index].x -= evt.dx;
	                        _this3.ctrlCircleGroup.children[index].y -= evt.dy;
	                        _this3.ctrlCircleGroup.children[index + 1].x += evt.dx;
	                        _this3.ctrlCircleGroup.children[index + 1].y += evt.dy;
	                    }

	                    _this3.draw();
	                },
	                down: function down() {
	                    _this3.willAdjust = true;
	                },
	                up: function up() {
	                    _this3.willAdjust = false;
	                }
	            });
	        }
	    }, {
	        key: 'closePath',
	        value: function closePath() {
	            if (this.closed) return;
	            this.circleGroup.visible = false;
	            this.ctrlCircleGroup.visible = false;
	            this.points.push(this.points[0], this.points[1]);
	            this.controlLines.visible = false;
	            var index = this.controlPoints.length;
	            this.controlPoints[index] = this.controlPoints[0];
	            this.controlPoints[index + 1] = this.controlPoints[1];
	            this.closed = true;

	            this.virtualCurve.visible = false;
	            this.draw();
	        }
	    }, {
	        key: 'draw',
	        value: function draw() {
	            this.updateCircleGroup();
	            this.renderCtrls();
	            this.renderCurve();
	        }
	    }, {
	        key: 'updateCircleGroup',
	        value: function updateCircleGroup() {
	            var children = this.ctrlCircleGroup.children,
	                len = children.length;
	            for (var i = 0; i < len; i += 2) {

	                children[i].x = this.controlPoints[i * 2];
	                children[i].y = this.controlPoints[i * 2 + 1];
	                children[i + 1].x = this.controlPoints[i * 2 + 2];
	                children[i + 1].y = this.controlPoints[i * 2 + 3];
	            }
	        }
	    }, {
	        key: 'renderCtrls',
	        value: function renderCtrls() {
	            var graphics = this.controlLines,
	                cps = this.controlPoints;

	            graphics.clear();
	            for (var i = 0, len = cps.length; i < len; i += 4) {
	                graphics.beginPath();
	                graphics.moveTo(cps[i], cps[i + 1]);
	                graphics.lineTo(cps[i + 2], cps[i + 3]);

	                graphics.stroke();
	            }
	        }
	    }, {
	        key: 'renderCurve',
	        value: function renderCurve() {
	            var curve = this.curve,
	                points = this.points,
	                controlPoints = this.controlPoints;
	            curve.clear();
	            curve.moveTo(points[0], points[1]);
	            for (var i = 0, len = points.length; i < len; i += 2) {
	                var index = i * 2;
	                curve.bezierCurveTo(controlPoints[index + 2], controlPoints[index + 3], controlPoints[index + 4], controlPoints[index + 5], points[i + 2], points[i + 3]);
	            }
	            curve.stroke();
	            // curve.closePath()
	            curve.fillStyle('white');
	            curve.fill();
	        }
	    }, {
	        key: 'renderVirtualCurve',
	        value: function renderVirtualCurve(currentX, currentY) {
	            var curve = this.virtualCurve,
	                points = this.points,
	                controlPoints = this.controlPoints;
	            var len = points.length,
	                cLen = controlPoints.length;
	            curve.clear();
	            curve.moveTo(points[len - 2], points[len - 1]);
	            curve.bezierCurveTo(controlPoints[cLen - 2], controlPoints[cLen - 1], currentX, currentY, currentX, currentY);
	            curve.stroke();
	        }
	    }]);

	    return BezierCurveShape;
	}(_index.Group);

	exports.default = BezierCurveShape;

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by dntzhang on 2017/4/9.
	 */

	var Drag = function () {
	    function Drag(target, option) {
	        _classCallCheck(this, Drag);

	        this.target = target;
	        this.isMouseDown = false;
	        this.preX = null;
	        this.preY = null;
	        var noop = function noop() {};
	        this.move = option.move || noop;
	        this.over = option.over || noop;
	        this.out = option.out || noop;
	        this.down = option.down || noop;
	        this.up = option.up || noop;
	        this.bindEvent();
	    }

	    _createClass(Drag, [{
	        key: 'bindEvent',
	        value: function bindEvent() {
	            var _this = this;

	            this._uh = this._upHandler.bind(this);
	            this._mh = this._moveHandler.bind(this);
	            var target = this.target;

	            target.addEventListener('mouseover', function (evt) {
	                _this.over(evt);
	            });

	            target.addEventListener('mouseout', function (evt) {
	                _this.out(evt);
	            });

	            target.addEventListener('mousedown', function (evt) {
	                _this.isMouseDown = true;
	                _this.preX = evt.stageX;
	                _this.preY = evt.stageY;
	                _this.down(evt);
	                document.addEventListener('mouseup', _this._uh, false);
	                document.addEventListener('mousemove', _this._mh, false);
	            });
	        }
	    }, {
	        key: '_moveHandler',
	        value: function _moveHandler(evt) {
	            if (this.isMouseDown) {
	                this.move({
	                    dx: evt.stageX - this.preX,
	                    dy: evt.stageY - this.preY,
	                    pureEvent: evt,
	                    target: this.target
	                });

	                this.preX = evt.stageX;
	                this.preY = evt.stageY;
	            }
	        }
	    }, {
	        key: '_upHandler',
	        value: function _upHandler(evt) {
	            this.isMouseDown = false;
	            this.up(evt);
	            this.preX = null;
	            this.preY = null;
	            document.removeEventListener('mousemove', this._mh, false);
	            document.removeEventListener('mouseup', this._uh, false);
	        }
	    }]);

	    return Drag;
	}();

	var drag = function drag(target, option) {
	    if (Object.prototype.toString.call(target) !== "[object Array]") {
	        target = [target];
	    }

	    target.forEach(function (item) {
	        if (!item._hasBindDrag) {
	            item._hasBindDrag = true;
	            new Drag(item, option);
	        }
	    });
	};

	exports.default = drag;

/***/ }
/******/ ]);