/**
 * 舞台，继承自Container
 * @class Stage
 * @constructor
 * @param {canvas} canvas
 * @param {bool} closeWebGL
 */
define("ARE.Stage:ARE.Container", {
    statics: {
        checkMove: false
    },
    ctor: function (canvas,closegl) {
        this._super();
        this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
       

        var canvasSupport = !!window.CanvasRenderingContext2D,
            webglSupport = (function () { try { var canvas = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))); } catch (e) { return false; } })();
       
        if (webglSupport && !closegl) {
            this.renderer = new WebGLRenderer(this);
        } else {
            this.ctx = this.canvas.getContext("2d");
            this.renderer = new CanvasRenderer(this);
        }

        Stage.renderer = this.renderer;
        this.hitRenderer = new CanvasRenderer(this);
        this.hitCanvas = document.createElement("canvas");
        this.hitCanvas.width =1;
        this.hitCanvas.height = 1;
        this.hitCtx = this.hitCanvas.getContext("2d");
        Function.prototype.bind = function () {
            var __method = this;
            var args = Array.prototype.slice.call(arguments);
            var object = args.shift();
            return function () {
                return __method.apply(object,
                     args.concat(Array.prototype.slice.call(arguments)));
            }
        }
     
        this._scaleX = this._scaleY = null;

        this.canvas.addEventListener("click", this._handleClick.bind(this), false);
        this.canvas.addEventListener("mousemove", this._handleMouseMove.bind(this), false);
        window.addEventListener("keydown", this._handleKeyDown.bind(this), false);
        window.addEventListener("keyup", this._handleKeyUp.bind(this), false);
        this.offset = this._getXY(this.canvas);

        this.overObj = null;
        this.pause = false;

       // this.tickFPS = 60;
        this.interval = Math.floor(1000 / 60);

        var self = this;
        self.loop = setInterval(function () {
            self._tick(self);
        }, self.interval);

        
        Object.defineProperty(this, "useRequestAnimFrame", {
            set: function (value) {
                this._useRequestAnimFrame = value;
                if (value) {
                    clearInterval(self.loop);
                    self.loop = RAF.requestInterval(function () {
                        self._tick(self);
                    }, self.interval)
                } else {
                    RAF.clearRequestInterval(self.loop);
                    self.loop = setInterval(function () {
                        self._tick(self);
                    }, self.interval);
                }
            },
            get: function () {
                return this._useRequestAnimFrame;
            }
        });

     
       
    },
    /**
     * 更新舞台
     * @method update
     */
    update: function () {
        if (!this.pause) {
            this.renderer.update();
        }
        //this.ctx.clearRect(0, 0, this.width, this.height);
        //this.draw(this.ctx);
    },
    _handleKeyDown: function (evt) {
        this.keyDownCallback && this.keyDownCallback(evt.keyCode)
    },
    _handleKeyUp: function (evt) {
        this.keyUpCallback && this.keyUpCallback(evt.keyCode)
    },
    _handleClick: function (evt) {
        // var child = this._getHitChild(this.hitCtx, evt.pageX - this.offset[0], evt.pageY - this.offset[1], "click");
        evt.stageX = evt.pageX - this.offset[0];
        evt.stageY = evt.pageY - this.offset[1];
        if (this._scaleX) {
            var p = this.correctingXY(evt.stageX, evt.stageY);
            evt.stageX = p.x;
            evt.stageY = p.y;
        }

        var callbacks = this.events["click"];
        if (callbacks) {
            for (var i = 0, len = callbacks.length; i < len; i++) {
                var callback = callbacks[i];
                callback(evt);
            }
        }
        var child = this.hitRenderer.hitRender(this.hitCtx, this, null, evt.stageX, evt.stageY, "click");
        // if (child) child.execEvent("click");
    },
    _handleMouseMove: function (evt) {
        evt.stageX = evt.pageX - this.offset[0];
        evt.stageY = evt.pageY - this.offset[1];
        if (this._scaleX) {
            var p = this.correctingXY(evt.stageX, evt.stageY);
            evt.stageX = p.x;
            evt.stageY = p.y;
        }
        var callbacks = this.events["mousemove"];
        if (callbacks) {
            for (var i = 0, len = callbacks.length; i < len; i++) {
                var callback = callbacks[i];
                callback(evt);
            }
        }
    },
    _getXY: function (el) {
        var _t = 0,_l = 0;
        if (document.documentElement.getBoundingClientRect && el.getBoundingClientRect) {
            var   box = el.getBoundingClientRect();
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
    destroy: function () {
        
    },
    //_initInterval移至add和remove 方法里以提高性能？但是fps动态变化需要再监听！
    _tick: function (container) {
       
        if (container.tick) {
            this._initInterval(container);
            if (!container.hasOwnProperty("_tickInterval")) {
                container.tick();
            } else {
                container._tickIntervalCurrent = new Date;
                if (!container._tickIntervalLast) container._tickIntervalLast = new Date;
                var itv = container._tickIntervalCurrent - container._tickIntervalLast;
                if ( itv*2> container._tickInterval ) {
                    container.tick();
                    container._tickIntervalLast = container._tickIntervalCurrent;
                }
            }
        }
        var children = container.children, len = children.length;
        for (var i = 0; i < len; i++) {
            var child = children[i];
            if (child.tick) {
                this._initInterval(child);
                if (!child.hasOwnProperty("_tickInterval")) {
                    child.tick();
                } else {
                    child._tickIntervalCurrent = new Date;
                    if (!child._tickIntervalLast) child._tickIntervalLast = new Date;
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
    },
    _initInterval: function (obj) {
        if (obj.hasOwnProperty("tickFPS")) {
            if (obj.tickFPS == 0) {
                obj._tickInterval = 10000;
              
            } else {
                obj._tickInterval = 1000 / obj.tickFPS;
            }
        } 
    },
    tick: function (fn) {
        this.tickFn && this.tickFn();
        this.update();
    },
    /**
     * 注册循环时要执行的函数
     * @method update
     */
    onTick: function (fn) {
        this.tickFn = fn;
    },
    setFPS:function(fps){

        this.interval=Math.floor(1000/fps);
    },
    onKeyDown: function (fn) {
        this.keyDownCallback = fn;
    },
    onKeyUp: function (fn) {
        this.keyUpCallback = fn;
    },
    onKeyboard: function (keyCombo, onDownCallback, onUpCallback) {
        Keyboard.on(keyCombo, onDownCallback, onUpCallback);
    },
    getActiveKeys:function(){

       return Keyboard.getActiveKeys();
    },
    scalable: function (scaleX,scaleY) {
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
        canvas.style.width = (scaleX * 100) + "%";
        canvas.style.height = (scaleY * 100) + "%";
        canvas.style.left = 100 * (1 - scaleX) / 2 + "%";
        canvas.style.top = 100 * (1 - scaleY) / 2 + "%";
        canvas.style.border = "0px solid #ccc";
        this.offset = this._getXY(this.canvas);
    },
    correctingXY: function (x,y) {
        return { x: x * this.canvas.width / (window.innerWidth * this._scaleX), y: y * this.canvas.height / (window.innerHeight * this._scaleY) };
    },
    getTotalCount: function () {
        var count = 0;

        function getCount(child) {

            if (child.baseInstanceof == "Container") {
                for (var i = 0, len = child.children.length; i < len; i++) {

                    if (child.children[i].baseInstanceof == "Container") {
                        getCount(child.children[i])
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
    getRenderingMode: function () {
        if (this.renderer instanceof CanvasRenderer) {
            return "Canvas";
        }
        return "WebGL";
    }
})


