
//begin-------------------ARE.Stage---------------------begin

ARE.Stage = ARE.Container.extend({
    "ctor": function(canvas, closegl) {
        this._super();
        this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.AABB = [0, 0, this.width, this.height];
        this.hitAABB = false;
        this.hitRenderer = new ARE.CanvasRenderer();
        this.hitCanvas = document.createElement("canvas");
        this.hitCanvas.width = 1;
        this.hitCanvas.height = 1;
        this.stageRenderer = new ARE.Renderer(this, closegl);
        this.hitCtx = this.hitCanvas.getContext("2d");
        this._scaleX = this._scaleY = null;
        this.offset = this._getXY(this.canvas);
        this.overObj = null;
        this._paused = false;
        this.fps = 63;
        this.interval = Math.floor(1e3 / this.fps);
        this.toList = [];
        var self = this;
        self.loop = setInterval(function() {
            if (self._paused) return;
            self._tick(self);
        }, self.interval);
        Object.defineProperty(this, "useRequestAnimFrame", {
            set: function(value) {
                this._useRequestAnimFrame = value;
                if (value) {
                    clearInterval(self.loop);
                    self.loop = ARE.RAF.requestInterval(function() {
                        self._tick(self);
                    }, self.interval);
                } else {
                    ARE.RAF.clearRequestInterval(self.loop);
                    self.loop = setInterval(function() {
                        self._tick(self);
                    }, self.interval);
                }
            },
            get: function() {
                return this._useRequestAnimFrame;
            }
        });
        this._watch(this, "fps", function(prop, value) {
            this.interval = Math.floor(1e3 / value);
            var self = this;
            if (this.useRequestAnimFrame) {
                clearInterval(this.loop);
                try {
                    ARE.RAF.clearRequestInterval(this.loop);
                } catch (e) {}
                this.loop = ARE.RAF.requestInterval(function() {
                    self._tick(self);
                }, this.interval);
            } else {
                ARE.RAF.clearRequestInterval(this.loop);
                try {
                    clearInterval(this.loop);
                } catch (e) {}
                this.loop = setInterval(function() {
                    self._tick(self);
                }, this.interval);
            }
        });
        this._initDebug();
        this._pressmoveObjs = null;
        this.baseInstanceof = "Stage";
        this.overObj = null;
        this._moveInterval = 16;
        this._preMoveTime = new Date();
        this._currentMoveTime = new Date();
        Object.defineProperty(this, "moveFPS", {
            set: function(value) {
                this._moveFPS = value;
                this._moveInterval = 1e3 / value;
            },
            get: function() {
                return this._moveFPS;
            }
        });
        this.canvas.addEventListener("mousemove", this._handleMouseMove.bind(this), false);
        this.canvas.addEventListener("click", this._handleClick.bind(this), false);
        this.canvas.addEventListener("mousedown", this._handleMouseDown.bind(this), false);
        this.canvas.addEventListener("mouseup", this._handleMouseUp.bind(this), false);
        this.canvas.addEventListener("dblclick", this._handleDblClick.bind(this), false);
        this.addEvent(this.canvas, "mousewheel", this._handleMouseWheel.bind(this));
        this.canvas.addEventListener("touchmove", this._handleMouseMove.bind(this), false);
        this.canvas.addEventListener("touchstart", this._handleMouseDown.bind(this), false);
        this.canvas.addEventListener("touchend", this._handleMouseUp.bind(this), false);
        document.addEventListener("DOMContentLoaded", this.adjustLayout.bind(this), false);
        window.addEventListener("load", this.adjustLayout.bind(this), false);
        window.addEventListener("resize", this.adjustLayout.bind(this), false);
    },
    "adjustLayout": function() {
        this.offset = this._getXY(this.canvas);
        if (this.domSurface) {
            this.domSurface.style.left = this.offset[0] + "px";
            this.domSurface.style.top = this.offset[1] + "px";
        }
        if (this._scaleX) {
            this.scaleToScreen(this._scaleX, this._scaleY);
        }
    },
    "pause": function () {
        this._paused = true;
        this._pauseSprite(this);
        this._pauseTween();

    },
    "play": function () {
        this._paused = false;
        this._playSprite(this);
        this._playTween();
    },
    "_pauseSprite": function (obj) {
        for (var i = 0, len = obj.children.length; i < len; i++) {
            var child = obj.children[i];
            if (child instanceof ARE.Container) {
                this._pauseSprite(child);
            } else if (child instanceof ARE.Sprite) {
                child.pause();
            }
        }
    },
    "_pauseTween": function () {
        for (var i = 0, len = this.toList.length; i < len; i++) {
            this.toList[i].pause();
        }
    },
    "_playSprite": function (obj) {
        for (var i = 0, len = obj.children.length; i < len; i++) {
            var child = obj.children[i];
            if (child instanceof ARE.Container) {
                this._playSprite(child);
            } else if (child instanceof ARE.Sprite) {
                child.play();
            }
        }
    },
    "_playTween": function () {
        for (var i = 0, len = this.toList.length; i < len; i++) {
            this.toList[i].play();
        }
    },
    "toggle": function () {
        if (this._paused) {
            this.play();
        } else {
            this.pause();
        }
    },
    "openDom": function() {
        this._initDomSurface();
    },
    "closeDom": function() {
        document.body.removeChild(this.domSurface);
    },
    "openDebug": function() {},
    "closeDebug": function() {},
    "_initDebug": function() {
        this.debugDiv = document.createElement("div");
        this.debugDiv.style.cssText = "display:none;position:absolute;z-index:2000;left:0;top:0;background-color:yellow;font-size:16px;";
        document.body.appendChild(this.debugDiv);
        Object.defineProperty(this, "debug", {
            set: function(value) {
                this._debug = value;
                if (this._debug) {
                    this.debugDiv.style.display = "block";
                } else {
                    this.debugDiv.style.display = "none";
                }
            },
            get: function() {
                return this._debug;
            }
        });
    },
    "_handleMouseWheel": function(event) {
        this._correctionEvent(event);
        var callbacks = this.events["mousewheel"];
        if (callbacks) {
            for (var i = 0, len = callbacks.length; i < len; i++) {
                var callback = callbacks[i];
                callback(event);
            }
        }
        event.preventDefault();
        if (this.overObj) {
            this.hitRenderer._bubbleEvent(this.overObj, "mousewheel", event);
        }
    },
    "_initDomSurface": function() {
        var self = this;
        this.domSurface = document.createElement("div");
        var style = this.domSurface.style;
        style.width = this.width + "px";
        style.height = this.height + "px";
        style.backgroundColor = "rgba(255,255,255,0)";
        style.zIndex = 1003;
        style.position = "absolute";
        style.border = "0px solid red";
        style.left = this.offset[0] + "px";
        style.top = this.offset[1] + "px";
        document.body.appendChild(this.domSurface);
        ARE.Stage.domSurface = this.domSurface;
        this.domSurface.addEventListener("mousemove", this._handleMouseMove.bind(this), false);
        this.domSurface.addEventListener("click", this._handleClick.bind(this), false);
        this.domSurface.addEventListener("mousedown", this._handleMouseDown.bind(this), false);
        this.domSurface.addEventListener("mouseup", this._handleMouseUp.bind(this), false);
        this.domSurface.addEventListener("dblclick", this._handleDblClick.bind(this), false);
        this.addEvent(this.domSurface, "mousewheel", this._handleMouseWheel.bind(this));
        this.domSurface.addEventListener("touchmove", this._handleMouseMove.bind(this), false);
        this.domSurface.addEventListener("touchstart", this._handleMouseDown.bind(this), false);
        this.domSurface.addEventListener("touchend", this._handleMouseUp.bind(this), false);
    },
    "update": function() {
        this.stageRenderer.update();
    },
    "_correctionEvent": function(evt) {
        if (evt.touches) {
            var firstTouch = evt.touches[0];
            if (firstTouch) {
                evt.stageX = firstTouch.pageX - this.offset[0];
                evt.stageY = firstTouch.pageY - this.offset[1];
            }
        } else {
            evt.stageX = evt.pageX - this.offset[0];
            evt.stageY = evt.pageY - this.offset[1];
        }
        if (this._scaleX) {
            var p = this.correctingXY(evt.stageX, evt.stageY);
            evt.stageX = Math.round(p.x);
            evt.stageY = Math.round(p.y);
        }
        var callbacks = this.events[evt.type];
        if (callbacks) {
            for (var i = 0, len = callbacks.length; i < len; i++) {
                var callback = callbacks[i];
                callback(evt);
            }
        }
        evt.preventDefault();
    },
    "_handleClick": function(evt) {
        this._correctionEvent(evt);
        this._getObjectUnderPoint(evt, evt.type);
    },
    "_handleMouseMove": function(evt) {
        this._correctionEvent(evt);
        if (this._pressmoveObjs) {
            var pressmoveHandle = this._pressmoveObjs.events["pressmove"];
            pressmoveHandle && this._pressmoveObjs.execEvent("pressmove", evt);
        }
        this._currentMoveTime = new Date();
        if (this._currentMoveTime - this._preMoveTime > this._moveInterval / 2) {
            var child = this._getObjectUnderPoint(evt, "mousemove");
            if (child) {
                if (this.overObj) {
                    if (child.id != this.overObj.id) {
                        this.hitRenderer._bubbleEvent(this.overObj, "mouseout", evt);
                        this.hitRenderer._bubbleEvent(child, "mouseover", evt);
                        this.overObj = child;
                    } else {
                        this.hitRenderer._bubbleEvent(child, "mousemove", evt);
                    }
                } else {
                    this.overObj = child;
                    this.hitRenderer._bubbleEvent(child, "mouseover", evt);
                }
            } else {
                if (this.overObj) {
                    this.hitRenderer._bubbleEvent(this.overObj, "mouseout", evt);
                    this.overObj = null;
                }
            }
            this._preMoveTime = this._currentMoveTime;
        }
    },
    "_getPressmoveTarget": function(o) {
        if (o.events["pressmove"]) {
            this._pressmoveObjs = o;
        }
        if (o.parent) this._getPressmoveTarget(o.parent);
    },
    "_handleMouseDown": function(evt) {
        this._correctionEvent(evt);
        var child = this._getObjectUnderPoint(evt, "pressdown");
        if (child) {
            this._getPressmoveTarget(child);
        }
    },
    "_handleMouseUp": function(evt) {
        this._pressmoveObjs = null;
        this._correctionEvent(evt);
        this._getObjectUnderPoint(evt, "pressup");
    },
    "_handleDblClick": function(evt) {
        this._correctionEvent(evt);
        this._getObjectUnderPoint(evt, evt.type);
    },
    "_getObjectUnderPoint": function(evt, type) {
        if (this.hitAABB) {
            return this.hitRenderer.hitAABB(this.hitCtx, this, evt, type);
        } else {
            return this.hitRenderer.hitRender(this.hitCtx, this, evt, type);
        }
    },
    "_getXY": function(el) {
        var _t = 0,
            _l = 0;
        if (document.documentElement.getBoundingClientRect && el.getBoundingClientRect) {
            var box = el.getBoundingClientRect();
            _l = box.left;
            _t = box.top;
        } else {
            while (el.offsetParent) {
                _t += el.offsetTop;
                _l += el.offsetLeft;
                el = el.offsetParent;
            }
            return [_l, _t];
        }
        return [_l + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft), _t + Math.max(document.documentElement.scrollTop, document.body.scrollTop)];
    },
    "_tick": function(container) {
        if (container && container.tick && container.tickFPS > 0) {
            this._initInterval(container);
            if (!container.hasOwnProperty("_tickInterval")) {
                container.tick();
            } else {
                container._tickIntervalCurrent = new Date();
                if (!container._tickIntervalLast) container._tickIntervalLast = new Date();
                var itv = container._tickIntervalCurrent - container._tickIntervalLast;
                if (itv * 2 > container._tickInterval) {
                    container.tick();
                    container._tickIntervalLast = container._tickIntervalCurrent;
                }
            }
        }
        var children = container.children,
            len = children.length;
        for (var i = 0; i < len; i++) {
            var child = children[i];
            if (child) {
                if (child.tick && child.tickFPS > 0) {
                    this._initInterval(child);
                    if (!child.hasOwnProperty("_tickInterval")) {
                        child.tick();
                    } else {
                        child._tickIntervalCurrent = new Date();
                        if (!child._tickIntervalLast) child._tickIntervalLast = new Date();
                        var itv = child._tickIntervalCurrent - child._tickIntervalLast;
                        if (itv * 2 > child._tickInterval) {
                            child.tick();
                            child._tickIntervalLast = child._tickIntervalCurrent;
                        }
                    }
                }
                if (child.baseInstanceof == "Container") {
                    this._tick(child);
                }
            }
        }
    },
    "_initInterval": function(obj) {
        if (obj.hasOwnProperty("tickFPS")) {
            obj._tickInterval = 1e3 / obj.tickFPS;
        }
    },
    "tick": function(fn) {
        this.tickFn && this.tickFn();
        this.update();
        if (this.debug) {
            this.getFPS();
            this.debugDiv.innerHTML = "fps : " + this.fpsValue + " <br/>average fps : " + this.averageFPS + " <br/>object count : " + this.getTotalCount() + " <br/>rendering mode : " + this.getRenderingMode() + " <br/>inner object count  : " + this.stageRenderer.objs.length;
        }
    },
    "onTick": function(fn) {
        this.tickFn = fn;
    },
    "setFPS": function(fps) {
        this.interval = Math.floor(1e3 / fps);
    },
    "onKeyboard": function(keyCombo, onDownCallback, onUpCallback) {
        ARE.Keyboard.on(keyCombo, onDownCallback, onUpCallback);
    },
    "getActiveKeys": function() {
        return ARE.Keyboard.getActiveKeys();
    },
    "scaleToScreen": function(scaleX, scaleY) {
        if (scaleX === 1 && scaleY === 1) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        }
        document.body.style.margin = 0;
        document.documentElement.style.margin = 0;
        document.body.style.border = 0;
        document.documentElement.style.border = 0;
        document.body.style.padding = 0;
        document.documentElement.style.padding = 0;
        document.body.style.width = "100%";
        document.documentElement.style.width = "100%";
        document.body.style.height = "100%";
        document.documentElement.style.height = "100%";
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        var canvas = this.canvas;
        canvas.style.position = "absolute";
        canvas.style.width = scaleX * 100 + "%";
        canvas.style.height = scaleY * 100 + "%";
        canvas.style.left = 100 * (1 - scaleX) / 2 + "%";
        canvas.style.top = 100 * (1 - scaleY) / 2 + "%";
        canvas.style.border = "0px solid #ccc";
        var domSurface = this.domSurface;
        if (domSurface) {
            domSurface.style.position = "absolute";
            domSurface.style.border = "0px solid #ccc";
            domSurface.style.transform = domSurface.style.msTransform = domSurface.style.OTransform = domSurface.style.MozTransform = domSurface.style.webkitTransform = "scale(" + window.innerWidth * this._scaleX / this.width + "," + window.innerHeight * this._scaleY / this.height + ")";
            this.offset = this._getXY(this.canvas);
            this.offset2 = this._getXY(domSurface);
            domSurface.style.left = parseInt(domSurface.style.left) - this.offset2[0] + this.offset[0] + "px";
            domSurface.style.top = parseInt(domSurface.style.top) - this.offset2[1] + this.offset[1] + "px";
        }
    },
    "correctingXY": function(x, y) {
        return {
            x: x * this.width / (window.innerWidth * this._scaleX),
            y: y * this.height / (window.innerHeight * this._scaleY)
        };
    },
    "getTotalCount": function() {
        var count = 0;
        var self = this;

        function getCount(child) {
            if (child.baseInstanceof == "Container" || child.baseInstanceof == "Stage") {
                for (var i = 0, len = child.children.length; i < len; i++) {
                    var subChild = child.children[i];
                    if (subChild instanceof ARE.Container) {
                        getCount(subChild);
                    } else {
                        count++;
                    }
                }
            } else {
                count++;
            }
        }
        getCount(this);
        return count;
    },
    "getRenderingMode": function() {
        if (this.stageRenderer.renderingEngine instanceof ARE.CanvasRenderer) {
            return "Canvas";
        }
        return "WebGL";
    },
    "getFPS": function() {
        var fps = ARE.FPS.get();
        this.fpsValue = fps.value;
        this.averageFPS = fps.averageFPS;
    },
    "addEvent": function(el, type, fn, capture) {
        if (type === "mousewheel" && document.mozHidden !== undefined) {
            type = "DOMMouseScroll";
        }
        el.addEventListener(type, function(event) {
            var type = event.type;
            if (type == "DOMMouseScroll" || type == "mousewheel") {
                event.delta = event.wheelDelta ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
            }
            fn.call(this, event);
        }, capture || false);
    },
    "setCursor": function(type) {
        this.canvas.style.cursor = type;
        if (this.domSurface) this.domSurface.style.cursor = type;
    }
});

//end-------------------ARE.Stage---------------------end
