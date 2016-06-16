/* Alloy Game Engine
 * By AlloyTeam http://www.alloyteam.com/
 * Github: https://github.com/AlloyTeam/AlloyGameEngine
 * MIT Licensed.
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.AlloyPaper = factory();
    }
}(this, function () {
'use strict';

// The base Class implementation (does nothing)
var Class = function () { };

// Create a new Class that inherits from this class
Class.extend = function (prop) {
    var _super = this.prototype;
    var prototype = Object.create(_super);

    // Copy the properties over onto the new prototype
    for (var name in prop) {
        if (name != "statics") {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function"  ?
                (function (temp_name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[temp_name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }
    }

    // The dummy class constructor
    function _Class() {
        // All construction is actually done in the init method

        this.ctor.apply(this, arguments);
    }

    //继承父类的静态属性
    for (var key in this) {
        if (this.hasOwnProperty(key) && key != "extend")
            _Class[key] = this[key];
    }

    // Populate our constructed prototype object
    _Class.prototype = prototype;

    _Class.prototype._super = Object.create(_super);
    //静态属性和方法
    if (prop.statics) {
        for (var key in prop.statics) {
            if (prop.statics.hasOwnProperty(key)) {
                _Class[key] = prop.statics[key];
                if (key == "ctor") {
                    //提前执行静态构造函数
                    _Class[key]();
                }
            }

        }
    }

    // Enforce the constructor to be what we expect
    _Class.prototype.constructor = _Class;

    // And make this class extendable
    _Class.extend = Class.extend;

    return _Class;
};

window.Class = Class;
//AlloyPaper
var AlloyPaper = {};

AlloyPaper.DefaultCursor = "default";

AlloyPaper.Cache = {};

//begin-------------------AlloyPaper.Matrix2D---------------------begin

AlloyPaper.Matrix2D = Class.extend({
    "statics": {
        "DEG_TO_RAD": 0.017453292519943295
    },
    "ctor": function(a, b, c, d, tx, ty) {
        this.a = a == null ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = d == null ? 1 : d;
        this.tx = tx || 0;
        this.ty = ty || 0;
        return this;
    },
    "identity": function() {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    },
    "appendTransform": function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation % 360) {
            var r = rotation * AlloyPaper.Matrix2D.DEG_TO_RAD;
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
    },
    "append": function(a, b, c, d, tx, ty) {
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
    },
    "initialize": function(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    },
    "setValues": function(a, b, c, d, tx, ty) {
        this.a = a == null ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = d == null ? 1 : d;
        this.tx = tx || 0;
        this.ty = ty || 0;
        return this;
    },
    "copy": function(matrix) {
        return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }
});

//end-------------------AlloyPaper.Matrix2D---------------------end


//begin-------------------AlloyPaper.UID---------------------begin

AlloyPaper.UID = Class.extend({
    "statics": {
        "_nextID": 0,
        "_nextCacheID": 1,
        "get": function() {
            return this._nextID++;
        },
        "getCacheID": function() {
            return this._nextCacheID++;
        }
    }
});

//end-------------------AlloyPaper.UID---------------------end


//begin-------------------AlloyPaper.Renderer---------------------begin

AlloyPaper.Renderer = Class.extend({
    "ctor": function (stage, openWebGL) {
        this.stage = stage;
        this.objs = [];
        this.width = this.stage.width;
        this.height = this.stage.height;
        this.mainCanvas = this.stage.canvas;
        var canvasSupport = !! window.CanvasRenderingContext2D,
            webglSupport = function() {
                try {
                    var canvas = document.createElement("canvas");
                    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
                } catch (e) {
                    return false;
                }
            }();
        if (webglSupport && openWebGL) {
            this.renderingEngine = new AlloyPaper.WebGLRenderer(this.stage.canvas);
        } else {
            if (canvasSupport) {
                this.renderingEngine = new AlloyPaper.CanvasRenderer(this.stage.canvas);
            } else {
                throw "your browser does not support canvas and webgl ";
            }
        }
        this.mainCtx = this.renderingEngine.ctx;
    },
    "update": function() {
        var objs = this.objs,
            ctx = this.mainCtx,
            engine = this.renderingEngine;
        objs.length = 0;
        this.computeMatrix();
        engine.clear();
        var l = objs.length;
        for (var m = 0; m < l; m++) {
            engine.renderObj(ctx, objs[m]);
        }
    },
    "computeMatrix": function() {
        for (var i = 0, len = this.stage.children.length; i < len; i++) {
            this._computeMatrix(this.stage.children[i]);
        }
    },
    "initComplex": function(o) {
        o.complexCompositeOperation = this._getCompositeOperation(o);
        o.complexAlpha = this._getAlpha(o, 1);
    },
    "_computeMatrix": function(o, mtx) {
        if (!o.isVisible()) {
            return;
        }
        if (mtx) {
            o._matrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        } else {
            o._matrix.initialize(1, 0, 0, 1, 0, 0);
        }
        if (o instanceof AlloyPaper.Shape) {
            o._matrix.appendTransform(o.x, o.y, 1, 1, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        } else {
            o._matrix.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        }
        if (o instanceof AlloyPaper.Container) {
            var list = o.children,
                len = list.length,
                i = 0;
            for (; i < len; i++) {
                this._computeMatrix(list[i], o._matrix);
            }
        } else {
            if (o instanceof AlloyPaper.Graphics || o instanceof AlloyPaper.Text) {
                this.objs.push(o);
                this.initComplex(o);
            } else {
                o.initAABB();
                if (this.isInStage(o)) {
                    this.objs.push(o);
                    this.initComplex(o);
                }
            }
        }
    },
    "_getCompositeOperation": function(o) {
        if (o.compositeOperation) return o.compositeOperation;
        if (o.parent) return this._getCompositeOperation(o.parent);
    },
    "_getAlpha": function(o, alpha) {
        var result = o.alpha * alpha;
        if (o.parent) {
            return this._getAlpha(o.parent, result);
        }
        return result;
    },
    "isInStage": function(o) {
        return this.collisionBetweenAABB(o.AABB, this.stage.AABB);
    },
    "collisionBetweenAABB": function(AABB1, AABB2) {
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
});

//end-------------------AlloyPaper.Renderer---------------------end


//begin-------------------AlloyPaper.CanvasRenderer---------------------begin

AlloyPaper.CanvasRenderer = Class.extend({
    "ctor": function(canvas) {
        if (canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext("2d");
            this.height = this.canvas.height;
            this.width = this.canvas.width;
        }
    },
    "hitAABB": function(ctx, o, evt, type) {
        var list = o.children.slice(0),
            l = list.length;
        for (var i = l - 1; i >= 0; i--) {
            var child = list[i];
            if (!this.isbindingEvent(child)) continue;
            var target = this._hitAABB(ctx, child, evt, type);
            if (target) return target;
        }
    },
    "_hitAABB": function(ctx, o, evt, type) {
        if (!o.isVisible()) {
            return;
        }
        if (o instanceof AlloyPaper.Container) {
            var list = o.children.slice(0),
                l = list.length;
            for (var i = l - 1; i >= 0; i--) {
                var child = list[i];
                var target = this._hitAABB(ctx, child, evt, type);
                if (target) return target;
            }
        } else {
            if (o.AABB && this.checkPointInAABB(evt.stageX, evt.stageY, o.AABB)) {
                this._bubbleEvent(o, type, evt);
                return o;
            }
        }
    },
    "hitRender": function(ctx, o, evt, type) {
        var mtx = o._hitMatrix;
        var list = o.children.slice(0),
            l = list.length;
        for (var i = l - 1; i >= 0; i--) {
            var child = list[i];
            mtx.initialize(1, 0, 0, 1, 0, 0);
            mtx.appendTransform(o.x - evt.stageX, o.y - evt.stageY, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            if (!this.isbindingEvent(child)) continue;
            ctx.save();
            var target = this._hitRender(ctx, child, mtx, evt, type);
            ctx.restore();
            if (target) return target;
        }
    },
    "_hitRender": function(ctx, o, mtx, evt, type) {
        ctx.clearRect(0, 0, 2, 2);
        if (!o.isVisible()) {
            return;
        }
        if (mtx) {
            o._hitMatrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        } else {
            o._hitMatrix.initialize(1, 0, 0, 1, 0, 0);
        }
        mtx = o._hitMatrix;
        if (o instanceof AlloyPaper.Shape) {
            mtx.appendTransform(o.x, o.y, 1, 1, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        } else {
            mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        }
        var mmyCanvas = o.cacheCanvas || o.txtCanvas || o.shapeCanvas;
        if (mmyCanvas) {
            ctx.globalAlpha = o.complexAlpha;
            ctx.globalCompositeOperation = o.complexCompositeOperation;
            ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            ctx.drawImage(mmyCanvas, 0, 0);
        } else if (o instanceof AlloyPaper.Container) {
            var list = o.children.slice(0),
                l = list.length;
            for (var i = l - 1; i >= 0; i--) {
                ctx.save();
                var target = this._hitRender(ctx, list[i], mtx, evt, type);
                if (target) return target;
                ctx.restore();
            }
        } else if (o instanceof AlloyPaper.Bitmap || o instanceof AlloyPaper.Sprite) {
            ctx.globalAlpha = o.complexAlpha;
            ctx.globalCompositeOperation = o.complexCompositeOperation;
            var rect = o.rect;
            ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
        } else if (o instanceof AlloyPaper.Graphics) {
            ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            o.draw(ctx);
        }
        if (ctx.getImageData(0, 0, 1, 1).data[3] > 1 && !(o instanceof AlloyPaper.Container)) {
            this._bubbleEvent(o, type, evt);
            return o;
        }
    },
    "_bubbleEvent": function(o, type, event) {
        var result = o.execEvent(type, event);
        if (result !== false) {
            if (o.parent && o.parent.events && o.parent.events[type] && o.parent.events[type].length > 0 && o.parent.baseInstanceof !== "Stage") {
                this._bubbleEvent(o.parent, type, event);
            }
        }
    },
    "isbindingEvent": function(obj) {
        if (Object.keys(obj.events).length !== 0) return true;
        if (obj instanceof AlloyPaper.Container) {
            for (var i = 0, len = obj.children.length; i < len; i++) {
                var child = obj.children[i];
                if (child instanceof AlloyPaper.Container) {
                    return this.isbindingEvent(child);
                } else {
                    if (Object.keys(child.events).length !== 0) return true;
                }
            }
        }
        return false;
    },
    "clear": function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    },
    "renderObj": function(ctx, o) {
        var mtx = o._matrix;
        ctx.save();
        ctx.globalAlpha = o.complexAlpha;
        ctx.globalCompositeOperation = o.complexCompositeOperation;
        o.shadow && this._applyShadow(ctx, o.shadow);
        var mmyCanvas = o.cacheCanvas || o.txtCanvas || o.shapeCanvas;
        if (mmyCanvas) {
            ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            ctx.drawImage(mmyCanvas, 0, 0);
        } else if (o instanceof AlloyPaper.Bitmap || o instanceof AlloyPaper.Sprite) {
            if (o._clipFn) {
                ctx.beginPath();
                o._clipFn.call(ctx);
                ctx.closePath();
                ctx.clip();
            } 
            var rect = o.rect;
            ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
        } else if (o instanceof AlloyPaper.Graphics || o instanceof AlloyPaper.Text) {
            ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            o.draw(ctx);
        }
        ctx.restore();
    },
    "_applyShadow" : function(ctx, shadow) {
        ctx.shadowColor = shadow.color || "transparent";
        ctx.shadowOffsetX = shadow.offsetX||0;
        ctx.shadowOffsetY = shadow.offsetY||0;
        ctx.shadowBlur = shadow.blur||0;
    },
    "clearBackUpCanvasCache": function() {},
    "checkPointInAABB": function(x, y, AABB) {
        var minX = AABB[0];
        if (x < minX) return false;
        var minY = AABB[1];
        if (y < minY) return false;
        var maxX = minX + AABB[2];
        if (x > maxX) return false;
        var maxY = minY + AABB[3];
        if (y > maxY) return false;
        return true;
    }
});

//end-------------------AlloyPaper.CanvasRenderer---------------------end


//begin-------------------AlloyPaper.DisplayObject---------------------begin

AlloyPaper.DisplayObject = Class.extend({
    "ctor": function() {
        this.alpha = this.scaleX = this.scaleY = this.scale = 1;
        this.x = this.y = this.rotation = this.originX = this.originY = this.skewX = this.skewY = this.width = this.height = this.regX = this.regY = 0;
        this.textureReady = true;
        this.visible = true;
        this._matrix = new AlloyPaper.Matrix2D();
        this._hitMatrix = new AlloyPaper.Matrix2D();
        this.events = {};
        this.id = AlloyPaper.UID.get();
        this.cacheID = 0;
        this.baseInstanceof = "DisplayObject";
        this.tickFPS = 60;
        var self = this;
        this._watch(this, "originX", function(prop, value) {
            if (typeof value === "string") {
                self.regX = parseInt(value);
            } else {
                self.regX = self.width * value;
            }
        });
        this._watch(this, "originY", function(prop, value) {
            if (typeof value === "string") {
                self.regY = parseInt(value);
            } else {
                self.regY = self.height * value;
            }
        });
        this._watch(this, "filter", function(prop, value) {
            self.setFilter.apply(self, value);
        });
        this._watch(this, "scale", function(prop, value) {
            this.scaleX = this.scaleY = this.scale;
        });
        this.cursor = "default";
        this.onHover(function () {
            //this._setCursor(this, this.cursor);
        }, function () {
            this._setCursor(this, AlloyPaper.DefaultCursor);
        });
    },
    "_watch": function(target, prop, onPropertyChanged) {
        if (typeof prop === "string") {
            target["__" + prop] = this[prop];
            Object.defineProperty(target, prop, {
                get: function() {
                    return this["__" + prop];
                },
                set: function(value) {
                    this["__" + prop] = value;
                    onPropertyChanged.apply(target, [prop, value]);
                }
            });
        } else {
            for (var i = 0, len = prop.length; i < len; i++) {
                var propName = prop[i];
                target["__" + propName] = this[propName];
                (function(propName) {
                    Object.defineProperty(target, propName, {
                        get: function() {
                            return this["__" + propName];
                        },
                        set: function(value) {
                            this["__" + propName] = value;
                            onPropertyChanged.apply(target, [propName, value]);
                        }
                    });
                })(propName);
            }
        }
    },
    "isVisible": function() {
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.textureReady);
    },
    "on": function(type, fn) {
        this.events[type] || (this.events[type] = []);
        this.events[type].push(fn);
    },
    "off": function (type, fn) {
        var fns=this.events[type];
        if (fns) {
            var i = 0, len = fns.length;
            for (; i < len; i++) {
                if (fns[i] === fn) {
                    fns.splice(i, 1);
                    break;
                }
            }
        }

    },
    "execEvent": function (type, event) {
        if (this.events) {
            var fns = this.events[type],
                result = true;
            if (fns) {
                for (var i = 0, len = fns.length; i < len; i++) {
                    result = fns[i].call(this, event);
                }
            }
            return result;
        }
    },
    "_setCursor": function (obj, type) {
        if (obj) {
            if (obj.parent instanceof AlloyPaper.Stage) {
                obj.parent.setCursor(type);
            } else {
                this._setCursor(obj.parent, type);
            }
        }
    },
    "clone": function() {
        var o = new AlloyPaper.DisplayObject();
        this.cloneProps(o);
        return o;
    },
    "cloneProps": function(o) {
        o.visible = this.visible;
        o.alpha = this.alpha;
        o.originX = this.originX;
        o.originY = this.originY;
        o.rotation = this.rotation;
        o.scaleX = this.scaleX;
        o.scaleY = this.scaleY;
        o.skewX = this.skewX;
        o.skewY = this.skewY;
        o.x = this.x;
        o.y = this.y;
        o.regX = this.regX;
        o.regY = this.regY;
    },
    "cache": function() {
        if (!this.cacheCanvas) {
            this.cacheCanvas = document.createElement("canvas");
            var bound = this.getBound();
            this.cacheCanvas.width = bound.width;
            this.cacheCanvas.height = bound.height;
            this.cacheCtx = this.cacheCanvas.getContext("2d");
        }
        this.cacheID = AlloyPaper.UID.getCacheID();
        this.updateCache(this.cacheCtx, this, bound.width, bound.width);
    },
    "uncache": function() {
        this.cacheCanvas = null;
        this.cacheCtx = null;
        this.cacheID = null;
    },
    "setFilter": function(r, g, b, a) {
        if (this.width === 0 || this.height === 0) return;
        this.uncache();
        this.cache();
        var imageData = this.cacheCtx.getImageData(0, 0, this.cacheCanvas.width, this.cacheCanvas.height);
        var pix = imageData.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            if (pix[i + 3] > 0) {
                pix[i] *= r;
                pix[i + 1] *= g;
                pix[i + 2] *= b;
                pix[i + 3] *= a;
            }
        }
        this.cacheCtx.putImageData(imageData, 0, 0);
    },
    "getBound": function() {
        return {
            width: this.width,
            height: this.height
        };
    },
    "toCenter": function() {
        this.originX = .5;
        this.originY = .5;
        this.x = this.parent.width / 2;
        this.y = this.parent.height / 2;
    },
    "destroy": function() {
        this.cacheCanvas = null;
        this.cacheCtx = null;
        this.cacheID = null;
        this._matrix = null;
        this.events = null;
        if (this.parent) {
            this.parent.remove(this);
        }
    },
    "initAABB": function() {
        var x,
            y,
            width = this.width,
            height = this.height,
            mtx = this._matrix;
        var x_a = width * mtx.a,
            x_b = width * mtx.b;
        var y_c = height * mtx.c,
            y_d = height * mtx.d;
        var tx = mtx.tx,
            ty = mtx.ty;
        var minX = tx,
            maxX = tx,
            minY = ty,
            maxY = ty;
        if ((x = x_a + tx) < minX) {
            minX = x;
        } else if (x > maxX) {
            maxX = x;
        }
        if ((x = x_a + y_c + tx) < minX) {
            minX = x;
        } else if (x > maxX) {
            maxX = x;
        }
        if ((x = y_c + tx) < minX) {
            minX = x;
        } else if (x > maxX) {
            maxX = x;
        }
        if ((y = x_b + ty) < minY) {
            minY = y;
        } else if (y > maxY) {
            maxY = y;
        }
        if ((y = x_b + y_d + ty) < minY) {
            minY = y;
        } else if (y > maxY) {
            maxY = y;
        }
        if ((y = y_d + ty) < minY) {
            minY = y;
        } else if (y > maxY) {
            maxY = y;
        }
        this.AABB = [minX, minY, maxX - minX, maxY - minY];
        this.rectPoints = [{
            x: tx,
            y: ty},{
            x: x_a + tx,
            y: x_b + ty},{
            x: x_a + y_c + tx,
            y: x_b + y_d + ty},{
            x: y_c + tx,
            y: y_d + ty}];
    },
    "updateCache": function(ctx, o, w, h) {
        ctx.clearRect(0, 0, w + 1, h + 1);
        this.renderCache(ctx, o);
    },
    "renderCache": function(ctx, o) {
        if (!o.isVisible()) {
            return;
        }
        if (o instanceof AlloyPaper.Container || o instanceof AlloyPaper.Stage) {
            var list = o.children.slice(0);
            for (var i = 0, l = list.length; i < l; i++) {
                ctx.save();
                this.render(ctx, list[i]);
                ctx.restore();
            }
        } else if (o instanceof AlloyPaper.Bitmap || o instanceof AlloyPaper.Sprite) {
            var rect = o.rect;
            ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
        } else if (o.txtCanvas) {
            ctx.drawImage(o.txtCanvas, 0, 0);
        } else if (o.shapeCanvas) {
            ctx.drawImage(o.shapeCanvas, 0, 0);
        }
    },
    "onClick": function(fn) {
        this.on("click", fn);
    },
    "onMouseDown": function(fn) {
        this.on("pressdown", fn);
    },
    "onMouseMove": function(fn) {
        this.on("mousemove", fn);
    },
    "onMouseUp": function(fn) {
        this.on("pressup", fn);
    },
    "onMouseOver": function(fn) {
        this.on("mouseover", fn);
    },
    "onMouseOut": function(fn) {
        this.on("mouseout", fn);
    },
    "onHover": function(over, out) {
        this.on("mouseover", over);
        this.on("mouseout", out);
    },
    "onPressDown": function(fn) {
        this.on("pressdown", fn);
    },
    "onPressMove": function(fn) {
        this.on("pressmove", fn);
    },
    "onPressUp": function(fn) {
        this.on("pressup", fn);
    },
    "onMouseWheel": function(fn) {
        this.on("mousewheel", fn);
    },
    "onTouchStart": function(fn) {
        this.on("pressdown", fn);
    },
    "onTouchMove": function(fn) {
        this.on("pressmove", fn);
    },
    "onTouchEnd": function(fn) {
        this.on("pressup", fn);
    },
    "onTouchCancel": function () {
        this.on("touchcancel", fn);
    },
    "onDbClick": function(fn) {
        this.on("dblclick", fn);
    },
    "addEventListener": function (type, handler) {
        this.on(this._normalizeEventType(type), handler);
    },
    "removeEventListener": function (type, handler) {
        this.off(this._normalizeEventType(type), handler);
    },
    "_normalizeEventType": function (type) {
        var newType = { "touchstart": "pressdown", "touchmove": "pressmove", "touchend": "pressup" }[type];
        if (newType) return newType;
        return type;
    }
});

//end-------------------AlloyPaper.DisplayObject---------------------end

AlloyPaper.Bitmap = AlloyPaper.DisplayObject.extend({
    "ctor": function(img) {
        this._super();
        Object.defineProperty(this, "rect", {
            get: function () {
                return this["__rect"];
            },
            set: function (value) {
                this["__rect"] = value;
                this.width = value[2];
                this.height = value[3];
                this.regX = value[2] * this.originX;
                this.regY = value[3] * this.originY;
            }
        });
        if (arguments.length === 0) return;
        if (typeof img == "string") {
            this._initWithSrc(img);
            this.imgSrc = img;
        } else {
            this._init(img);
            this.imgSrc = img.src;
        }
    },
    "_initWithSrc": function(img) {
        var cacheImg = AlloyPaper.Cache[img];
        if (cacheImg) {
            this._init(cacheImg);
        } else {
            var self = this;
            this.textureReady = false;
            this.img = document.createElement("img");
            this.img.crossOrigin = "Anonymous";
            this.img.onload = function () {
                if (!self.rect) self.rect = [0, 0, self.img.width, self.img.height];
                AlloyPaper.Cache[img] = self.img;
                self.textureReady = true;
                self.imageLoadHandle && self.imageLoadHandle();
                if (self.filter) self.filter = self.filter;
            };
            this.img.src = img;
        }
    },
    "_init": function(img) {
        if (!img) return;
        this.img = img;
        this.img.crossOrigin = "Anonymous";
        this.width = img.width;
        this.height = img.height;
        this.rect = [0, 0, img.width, img.height];
    },
    "useImage": function(img) {
        if (typeof img == "string") {
            this._initWithSrc(img);
        } else {
            this._init(img);
            this.imageLoadHandle && this.imageLoadHandle();
        }
    },
    "onImageLoad": function(fn) {
        this.imageLoadHandle = fn;
    },
    "clone": function () {
        if (this.textureReady) {
            var o = new AlloyPaper.Bitmap(this.img);
            o.rect = this.rect.slice(0);
            this.cloneProps(o);
            return o;
        } else {
            var o = new AlloyPaper.Bitmap(this.imgSrc);
            this.rect&&(o.rect = this.rect.slice(0));
            this.cloneProps(o);
            return o;
        }
    },
    "clip": function (fn) {
        this._clipFn = fn;
    },
    "flipX": function() {},
    "flipY": function() {}
});

//begin-------------------AlloyPaper.Container---------------------begin

AlloyPaper.Container = AlloyPaper.DisplayObject.extend({
    "ctor": function() {
        this._super();
        this.children = [];
        this.baseInstanceof = "Container";
    },
    "add": function(obj) {
        var len = arguments.length;
        if (len > 1) {
            for (var i = 0; i < len; i++) {
                var item = arguments[i];
                if (item) {
                    this.children.push(item);
                    item.parent = this;
                }
            }
        } else {
            if (obj) {
                this.children.push(obj);
                obj.parent = this;
            }
        }
    },
    "remove": function(obj) {
        var len = arguments.length,
            childLen = this.children.length;
        if (len > 1) {
            for (var j = 0; j < len; j++) {
                var currentObj = arguments[j];
                for (var k = childLen; --k >= 0;) {
                    if (currentObj&&this.children[k].id == currentObj.id) {
                        currentObj.parent = null;
                        this.children.splice(k, 1);
                        break;
                    }
                }
            }
        } else {
            for (var i = childLen; --i >= 0;) {
                if (obj&&this.children[i].id == obj.id) {
                    obj.parent = null;
                    this.children.splice(i, 1);
                    break;
                }
            }
        }
    },
    "clone": function() {
        var o = new AlloyPaper.Container();
        this.cloneProps(o);
        var arr = o.children = [];
        for (var i = this.children.length - 1; i > -1; i--) {
            var clone = this.children[i].clone();
            arr.unshift(clone);
        }
        return o;
    },
    "removeAll": function() {
        var kids = this.children;
        while (kids.length) {
            kids.pop().parent = null;
        }
    },
    "destroy": function() {
        this._super();
        var kids = this.children;
        while (kids.length) {
            var kid = kids.pop();
            kid.destroy();
            kid = null;
        }
    },
    "swapChildrenAt": function(index1, index2) {
        var kids = this.children;
        var o1 = kids[index1];
        var o2 = kids[index2];
        if (!o1 || !o2) {
            return;
        }
        kids[index1] = o2;
        kids[index2] = o1;
    },
    "swapChildren": function(child1, child2) {
        var kids = this.children;
        var index1, index2;
        for (var i = 0, l = kids.length; i < l; i++) {
            if (kids[i] == child1) {
                index1 = i;
            }
            if (kids[i] == child2) {
                index2 = i;
            }
            if (index1 != null && index2 != null) {
                break;
            }
        }
        if (i == l) {
            return;
        }
        kids[index1] = child2;
        kids[index2] = child1;
    },
    "swapToTop": function(child) {
        this.swapChildren(child, this.children[this.children.length - 1]);
    }
});

//end-------------------AlloyPaper.Container---------------------end


//begin-------------------AlloyPaper.Graphics---------------------begin

AlloyPaper.Graphics = AlloyPaper.DisplayObject.extend({
    "ctor": function() {
        this._super();
        this.cmds = [];
        this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];

        this.currentGradient = null;
    },
    "draw": function(ctx) {
        for (var i = 0, len = this.cmds.length; i < len; i++) {
            var cmd = this.cmds[i], methodName = cmd[0];
            if (this.assMethod.join("-").match(new RegExp("\\b" + methodName + "\\b", "g"))) {
                console.log(methodName,cmd)
                ctx[methodName] = cmd[1][0];
            } else if (methodName === "addColorStop") {
                this.currentGradient && this.currentGradient.addColorStop(cmd[1][0], cmd[1][1]);
            } else if(methodName ==="fillGradient"){
                ctx.fillStyle = this.currentGradient;
            }else {
                var result = ctx[methodName].apply(ctx, Array.prototype.slice.call(cmd[1]));
                if (methodName === "createRadialGradient" || methodName === "createLinearGradient") {
                    this.currentGradient = result;
                }
                
            }
        }
    },
    "clearRect": function(x, y, width, height) {
        this.cmds.push(["clearRect", arguments]);
        return this;
    },
    "clear": function() {
        this.cmds.length = 0;
        return this;
    },
    "strokeRect": function() {
        this.cmds.push(["strokeRect", arguments]);
        return this;
    },
    "fillRect": function() {
        this.cmds.push(["fillRect", arguments]);
        return this;
    },
    "beginPath": function() {
        this.cmds.push(["beginPath", arguments]);
        return this;
    },
    "arc": function() {
        this.cmds.push(["arc", arguments]);
        return this;
    },
    "closePath": function() {
        this.cmds.push(["closePath", arguments]);
        return this;
    },
    "fillStyle": function() {
        this.cmds.push(["fillStyle", arguments]);
        return this;
    },
    "fill": function() {
        this.cmds.push(["fill", arguments]);
        return this;
    },
    "strokeStyle": function() {
        this.cmds.push(["strokeStyle", arguments]);
        return this;
    },
    "lineWidth": function() {
        this.cmds.push(["lineWidth", arguments]);
        return this;
    },
    "stroke": function() {
        this.cmds.push(["stroke", arguments]);
        return this;
    },
    "moveTo": function() {
        this.cmds.push(["moveTo", arguments]);
        return this;
    },
    "lineTo": function() {
        this.cmds.push(["lineTo", arguments]);
        return this;
    },
    "bezierCurveTo": function() {
        this.cmds.push(["bezierCurveTo", arguments]);
        return this;
    },
    "createRadialGradient": function () {
        this.cmds.push(["createRadialGradient", arguments]);
        return this;
    },
    "createLinearGradient": function () {
        this.cmds.push(["createLinearGradient", arguments]);
        return this;
    },
    "addColorStop": function () {
        this.cmds.push(["addColorStop", arguments]);
        return this;
    },
    "fillGradient": function () {
        this.cmds.push(["fillGradient"]);
        return this;
    },
    "clone": function () {

    }
});

//end-------------------AlloyPaper.Graphics---------------------end


//begin-------------------AlloyPaper.Label---------------------begin

AlloyPaper.Label = AlloyPaper.DisplayObject.extend({
    "ctor": function(option) {
        this._super();
        this.value = option.value;
        this.fontSize = option.fontSize;
        this.fontFamily = option.fontFamily;
        this.color = option.color;
        this.textAlign = "center";
        this.textBaseline = "top";
        this.fontWeight = option.fontWeight || "";
        this.maxWidth = option.maxWidth || 2e3;
        this.square = option.square || false;
        this.txtCanvas = document.createElement("canvas");
        this.txtCtx = this.txtCanvas.getContext("2d");
        this.setDrawOption();
        this.shadow = option.shadow;
        this._watch(this, ["value", "fontSize", "color", "fontFamily"], function() {
            this.setDrawOption();
        });
    },
    "setDrawOption": function() {
        var drawOption = this.getDrawOption({
            txt: this.value,
            maxWidth: this.maxWidth,
            square: this.square,
            size: this.fontSize,
            alignment: this.textAlign,
            color: this.color || "black",
            fontFamily: this.fontFamily,
            fontWeight: this.fontWeight,
            shadow: this.shadow
        });
        this.cacheID = AlloyPaper.UID.getCacheID();
        this.width = drawOption.calculatedWidth;
        this.height = drawOption.calculatedHeight;
    },
    "getDrawOption": function(option) {
        var canvas = this.txtCanvas;
        var ctx = this.txtCtx;
        var canvasX, canvasY;
        var textX, textY;
        var text = [];
        var textToWrite = option.txt;
        var maxWidth = option.maxWidth;
        var squareTexture = option.square;
        var textHeight = option.size;
        var textAlignment = option.alignment;
        var textColour = option.color;
        var fontFamily = option.fontFamily;
        var fontWeight = option.fontWeight;
        ctx.font = textHeight + "px " + fontFamily;
        if (maxWidth && this.measureText(ctx, textToWrite) > maxWidth) {
            maxWidth = this.createMultilineText(ctx, textToWrite, maxWidth, text);
            canvasX = this.getPowerOfTwo(maxWidth);
        } else {
            text.push(textToWrite);
            canvasX = this.getPowerOfTwo(ctx.measureText(textToWrite).width);
        }
        canvasY = this.getPowerOfTwo(textHeight * (text.length + 1));
        if (squareTexture) {
            canvasX > canvasY ? canvasY = canvasX : canvasX = canvasY;
        }
        option.calculatedWidth = canvasX;
        option.calculatedHeight = canvasY;
        canvas.width = canvasX;
        canvas.height = canvasY;
        switch (textAlignment) {
        case "left":
            textX = 0;
            break;
        case "center":
            textX = canvasX / 2;
            break;
        case "right":
            textX = canvasX;
            break;
        }
        textY = canvasY / 2;
        ctx.fillStyle = textColour;
        ctx.textAlign = textAlignment;
        ctx.textBaseline = "middle";
        ctx.font = fontWeight + " " + textHeight + "px " + fontFamily;
        if (option.shadow) {
            ctx.shadowColor = option.shadow.color || "transparent";
            ctx.shadowOffsetX = option.shadow.offsetX || 0;
            ctx.shadowOffsetY = option.shadow.offsetY || 0;
            ctx.shadowBlur = option.shadow.blur || 0;
        } 
        var offset = (canvasY - textHeight * (text.length + 1)) * .5;
        option.cmd = [];
        for (var i = 0; i < text.length; i++) {
            if (text.length > 1) {
                textY = (i + 1) * textHeight + offset;
            }
            option.cmd.push({
                text: text[i],
                x: textX,
                y: textY
            });
            ctx.fillText(text[i], textX, textY);
        }
        return option;
    },
    "getPowerOfTwo": function(value, pow) {
        var temp_pow = pow || 1;
        while (temp_pow < value) {
            temp_pow *= 2;
        }
        return temp_pow;
    },
    "measureText": function(ctx, textToMeasure) {
        return ctx.measureText(textToMeasure).width;
    },
    "createMultilineText": function(ctx, textToWrite, maxWidth, text) {
        textToWrite = textToWrite.replace("\n", " ");
        var currentText = textToWrite;
        var futureText;
        var subWidth = 0;
        var maxLineWidth;
        var wordArray = textToWrite.split(" ");
        var wordsInCurrent, wordArrayLength;
        wordsInCurrent = wordArrayLength = wordArray.length;
        while (this.measureText(ctx, currentText) > maxWidth && wordsInCurrent > 1) {
            wordsInCurrent--;
            currentText = futureText = "";
            for (var i = 0; i < wordArrayLength; i++) {
                if (i < wordsInCurrent) {
                    currentText += wordArray[i];
                    if (i + 1 < wordsInCurrent) {
                        currentText += " ";
                    }
                } else {
                    futureText += wordArray[i];
                    if (i + 1 < wordArrayLength) {
                        futureText += " ";
                    }
                }
            }
        }
        text.push(currentText);
        maxLineWidth = this.measureText(ctx, currentText);
        if (futureText) {
            subWidth = this.createMultilineText(ctx, futureText, maxWidth, text);
            if (subWidth > maxLineWidth) {
                maxLineWidth = subWidth;
            }
        }
        return maxLineWidth;
    },
    "draw": function(ctx) {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign || "left";
        ctx.textBaseline = this.textBaseline || "top";
        ctx.fillText(this.text, 0, 0);
    }
});

//end-------------------AlloyPaper.Label---------------------end


//begin-------------------AlloyPaper.Shape---------------------begin

AlloyPaper.Shape = AlloyPaper.DisplayObject.extend({
    "ctor": function(width, height, debug) {
        this._super();
        this.cmds = [];
        this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];
        this.width = width;
        this.height = height;
        this._width = width;
        this._height = height;
        this.shapeCanvas = document.createElement("canvas");
        this.shapeCanvas.width = this.width;
        this.shapeCanvas.height = this.height;
        this.shapeCtx = this.shapeCanvas.getContext("2d");
        if (debug) {
            this.fillStyle("red");
            this.fillRect(0, 0, width, height);
        }
        this._watch(this, "scaleX", function(prop, value) {
            this.width = this._width * value;
            this.height = this._height * this.scaleY;
            this.shapeCanvas.width = this.width;
            this.shapeCanvas.height = this.height;
            this.shapeCtx.scale(value, this.scaleY);
            this.end();
        });
        this._watch(this, "scaleY", function(prop, value) {
            this.width = this._width * this.scaleX;
            this.height = this._height * value;
            this.shapeCanvas.width = this.width;
            this.shapeCanvas.height = this.height;
            this.shapeCtx.scale(this.scaleX, value);
            this.end();
        });
    },
    "end": function() {
        this._preCacheId = this.cacheID;
        this.cacheID = AlloyPaper.UID.getCacheID();
        var ctx = this.shapeCtx;
        for (var i = 0, len = this.cmds.length; i < len; i++) {
            var cmd = this.cmds[i];
            if (this.assMethod.join("-").match(new RegExp("\\b" + cmd[0] + "\\b", "g"))) {
                ctx[cmd[0]] = cmd[1][0];
            } else {
                ctx[cmd[0]].apply(ctx, Array.prototype.slice.call(cmd[1]));
            }
        }
    },
    "clearRect": function(x, y, width, height) {
        this.cacheID = AlloyPaper.UID.getCacheID();
        this.shapeCtx.clearRect(x, y, width, height);
    },
    "clear": function() {
        this.cacheID = AlloyPaper.UID.getCacheID();
        this.cmds.length = 0;
        this.shapeCtx.clearRect(0, 0, this.width, this.height);
    },
    "strokeRect": function() {
        this.cmds.push(["strokeRect", arguments]);
        return this;
    },
    "fillRect": function() {
        this.cmds.push(["fillRect", arguments]);
        return this;
    },
    "beginPath": function() {
        this.cmds.push(["beginPath", arguments]);
        return this;
    },
    "arc": function() {
        this.cmds.push(["arc", arguments]);
        return this;
    },
    "closePath": function() {
        this.cmds.push(["closePath", arguments]);
        return this;
    },
    "fillStyle": function() {
        this.cmds.push(["fillStyle", arguments]);
        return this;
    },
    "fill": function() {
        this.cmds.push(["fill", arguments]);
        return this;
    },
    "strokeStyle": function() {
        this.cmds.push(["strokeStyle", arguments]);
        return this;
    },
    "lineWidth": function() {
        this.cmds.push(["lineWidth", arguments]);
        return this;
    },
    "stroke": function() {
        this.cmds.push(["stroke", arguments]);
        return this;
    },
    "moveTo": function() {
        this.cmds.push(["moveTo", arguments]);
        return this;
    },
    "lineTo": function() {
        this.cmds.push(["lineTo", arguments]);
        return this;
    },
    "bezierCurveTo": function() {
        this.cmds.push(["bezierCurveTo", arguments]);
        return this;
    },
    "clone": function() {}
});

//end-------------------AlloyPaper.Shape---------------------end


//begin-------------------AlloyPaper.Sprite---------------------begin

AlloyPaper.Sprite = AlloyPaper.DisplayObject.extend({
    "ctor": function(option) {
        this._super();
        this.option = option;
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.currentFrameIndex = 0;
        this.animationFrameIndex = 0;
        this.currentAnimation = option.currentAnimation || null;
        this.rect = [0, 0, 10, 10];
        this.visible = false;
        this.bitmaps = [];
        this._loadedCount = 0;
        var len = this.option.imgs.length;
        for (var i = 0; i < len; i++) {
            var urlOrImg = this.option.imgs[i];
            if (typeof urlOrImg === "string") {
                if (AlloyPaper.Cache[urlOrImg]) {
                    this.bitmaps.push(new AlloyPaper.Bitmap(AlloyPaper.Cache[urlOrImg]));
                    this._loadedCount++;
                } else {
                    (function(){
                        var bmp = new AlloyPaper.Bitmap();
                        bmp._sprite = this;
                        bmp.onImageLoad(function() {
                            bmp._sprite._loadedCount++;
                            if (bmp._sprite._loadedCount === len) {
                                bmp._sprite.visible = true;
                                delete bmp._sprite;
                            }
                        });
                        bmp.useImage(this.option.imgs[i]);
                        this.bitmaps.push(bmp);
                    })();
                }
            } else {
                this._loadedCount++;
                this.bitmaps.push(new AlloyPaper.Bitmap(urlOrImg));
            }
        }
        if (this._loadedCount === len) {
            this.visible = true;
        }
        this.img = this.bitmaps[0].img;
        this.interval = 1e3 / option.framerate;
        this.loop = null;
        this.paused = false;
        this.animationEnd = option.animationEnd || null;
        if (this.currentAnimation) {
            this.gotoAndPlay(this.currentAnimation);
        }
        this.tickAnimationEnd = option.tickAnimationEnd || null;
    },
    "play": function() {
        this.paused = false;
    },
    "pause": function () {
        this.paused = true;
    },
    "reset": function() {
        this.currentFrameIndex = 0;
        this.animationFrameIndex = 0;
    },
    "gotoAndPlay": function(animation, times) {
        this.paused = false;
        this.reset();
        clearInterval(this.loop);
        this.currentAnimation = animation;
        var self = this;
        var playTimes = 0;
        this.loop = setInterval(function() {
            if (!self.paused) {
                var opt = self.option;
                var frames = opt.animations[self.currentAnimation].frames,
                    len = frames.length;
                self.animationFrameIndex++;
                if (self.animationFrameIndex > len - 1) {
                    playTimes++;
                    self.animationFrameIndex = 0;
                    if (self.tickAnimationEnd) {
                        self.tickAnimationEnd();
                    }
                    if (times && playTimes == times) {
                        if (self.animationEnd) self.animationEnd();
                        self.paused = true;
                        clearInterval(self.loop);
                        self.parent.remove(self);
                    }
                }
                self.rect = opt.frames[frames[self.animationFrameIndex]];
                self.width = self.rect[2];
                self.height = self.rect[3];
                var rect = self.rect,
                    rectLen = rect.length;
                rectLen > 4 && (self.regX = rect[2] * rect[4]);
                rectLen > 5 && (self.regY = rect[3] * rect[5]);
                rectLen > 6 && (self.img = self.bitmaps[rect[6]].img);
            }
        }, this.interval);
    },
    "gotoAndStop": function(animation) {
        this.reset();
        clearInterval(this.loop);
        var self = this;
        self.currentAnimation = animation;
        var opt = self.option;
        var frames = opt.animations[self.currentAnimation].frames;
        self.rect = opt.frames[frames[self.animationFrameIndex]];
        self.width = self.rect[2];
        self.height = self.rect[3];
        var rect = self.rect,
            rectLen = rect.length;
        rectLen > 4 && (self.regX = rect[2] * rect[4]);
        rectLen > 5 && (self.regY = rect[3] * rect[5]);
        rectLen > 6 && (self.img = self.bitmaps[rect[6]].img);
    }
});

//end-------------------AlloyPaper.Sprite---------------------end

AlloyPaper.Stage = AlloyPaper.Container.extend({
    "ctor": function(canvas, openWebGL) {
        this._super();
        this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.AABB = [0, 0, this.width, this.height];
        this.hitAABB = true;
        this.hitRenderer = new AlloyPaper.CanvasRenderer();
        this.hitCanvas = document.createElement("canvas");
        this.hitCanvas.width = 1;
        this.hitCanvas.height = 1;
        this.stageRenderer = new AlloyPaper.Renderer(this, openWebGL);
        this.hitCtx = this.hitCanvas.getContext("2d");
        this._scaleX = this._scaleY = null;
        this.offset = this._getXY(this.canvas);
        this.overObj = null;
        this._paused = false;
        this.fps = 63;
        this.interval = Math.floor(1e3 / this.fps);
        this.toList = [];
        this.tickFns = [];
        this.beginTick = null;
        this.endTick = null;
        var self = this;
        self.loop = setInterval(function() {
            if (self._paused) return;
            self.beginTick && self.beginTick();
            self._tick(self);
            self.endTick && self.endTick();
        }, self.interval);
        Object.defineProperty(this, "useRequestAnimFrame", {
            set: function(value) {
                this._useRequestAnimFrame = value;
                if (value) {
                    clearInterval(self.loop);
                    self.loop = AlloyPaper.RAF.requestInterval(function() {
                        self._tick(self);
                    }, self.interval);
                } else {
                    AlloyPaper.RAF.clearRequestInterval(self.loop);
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
                    AlloyPaper.RAF.clearRequestInterval(this.loop);
                } catch (e) {}
                this.loop = AlloyPaper.RAF.requestInterval(function() {
                    self._tick(self);
                }, this.interval);
            } else {
                AlloyPaper.RAF.clearRequestInterval(this.loop);
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
        this.canvas.addEventListener("touchcancel", this._handleTouchCancel.bind(this), false);
        document.addEventListener("DOMContentLoaded", this.adjustLayout.bind(this), false);
        window.addEventListener("load", this.adjustLayout.bind(this), false);
        window.addEventListener("resize", this.adjustLayout.bind(this), false);
        this.autoUpdate = true;
        this.scaleType = "normal";

        this.setCursor(AlloyPaper.DefaultCursor);
    },
    "adjustLayout": function() {
        this.offset = this._getXY(this.canvas);
        this.style=this._getStyle();
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
            if (child instanceof AlloyPaper.Container) {
                this._pauseSprite(child);
            } else if (child instanceof AlloyPaper.Sprite) {
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
            if (child instanceof AlloyPaper.Container) {
                this._playSprite(child);
            } else if (child instanceof AlloyPaper.Sprite) {
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
    "openDebug": function() {},
    "closeDebug": function() {},
    "_initDebug": function() {
        this.debugDiv = document.createElement("div");
        this.debugDiv.style.cssText = "display:none;position:absolute;z-index:2000;left:0;bottom:0;background-color:yellow;font-size:16px;";
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
        this._correctionEvent(event, event.type);
        var callbacks = this.events["mousewheel"];
        if (callbacks) {
            for (var i = 0, len = callbacks.length; i < len; i++) {
                var callback = callbacks[i];
                callback(event);
            }
        }
        if (this.overObj) {
            this.hitRenderer._bubbleEvent(this.overObj, "mousewheel", event);
        }
    },
    "update": function() {
        this.stageRenderer.update();
    },
    "_correctionEvent": function (evt, type) {
        //this.adjustLayout();
        if (evt.touches||evt.changedTouches) {
            var firstTouch = evt.touches[0] || evt.changedTouches[0];
            if (firstTouch) {
                evt.stageX = firstTouch.pageX;
                evt.stageY = firstTouch.pageY;
            }
        } else {
            evt.stageX = evt.pageX;
            evt.stageY = evt.pageY;
        }
        //if (this.scaleType !== "normal") {
            var p = this._correction(evt.stageX, evt.stageY);
            evt.stageX = Math.round(p.x);
            evt.stageY = Math.round(p.y);
        //}
        var callbacks = this.events[type];
        if (callbacks) {
            for (var i = 0, len = callbacks.length; i < len; i++) {
                var callback = callbacks[i];
                callback(evt);
            }
        }
    },
    "_handleClick": function(evt) {
        this._correctionEvent(evt, evt.type);
        this._getObjectUnderPoint(evt, evt.type);
    },
    "_handleMouseMove": function(evt) {
        this._currentMoveTime = new Date();
        if (this._currentMoveTime - this._preMoveTime > this._moveInterval / 2) {
            this._correctionEvent(evt, evt.type);
            if (this._pressmoveObjs) {
                var pressmoveHandle = this._pressmoveObjs.events["pressmove"];
                pressmoveHandle && this._pressmoveObjs.execEvent("pressmove", evt);
            }
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
                    this._setCursorByOverObject(child);
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
        this._correctionEvent(evt, "pressdown");
        var child = this._getObjectUnderPoint(evt, "pressdown");
        if (child) {
            this._getPressmoveTarget(child);
        }
    },
    "_handleMouseUp": function(evt) {
        this._pressmoveObjs = null;
        this._correctionEvent(evt, "pressup");
        this._getObjectUnderPoint(evt, "pressup");
    },
    "_handleTouchCancel": function (evt) {
        this._pressmoveObjs = null;
        this._correctionEvent(evt, "touchcancel");
        this._getObjectUnderPoint(evt, "touchcancel");
    },
    "_handleDblClick": function(evt) {
        this._correctionEvent(evt, evt.type);
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
                if (!container._tickIntervalLast) {
                    container._tickIntervalLast = new Date();
                    container._tickIntervalPrev = new Date();
                }

                var itv = (container._tickIntervalCurrent - container._tickIntervalLast) +( container._tickIntervalCurrent - container._tickIntervalPrev);
                if (itv > container._tickInterval) {
                    container.tick();
                    container._tickIntervalLast = container._tickIntervalCurrent;
                }
                container._tickIntervalPrev= new Date();

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
                        if (!child._tickIntervalLast){
                            child._tickIntervalLast = new Date();
                            child._tickIntervalPrev = new Date();
                        }
                        var itv =( child._tickIntervalCurrent - child._tickIntervalLast)+(child._tickIntervalCurrent-child._tickIntervalPrev);
                        if (itv > child._tickInterval) {
                            child.tick();
                            child._tickIntervalLast = child._tickIntervalCurrent;
                        }
                        child._tickIntervalPrev= new Date();

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
    "tick": function () {
        for (var i = 0, len = this.tickFns.length; i < len; i++) {
            var fn = this.tickFns[i];
            if (!fn.hasOwnProperty("_ARE_PrevDate")) {
                fn();
                continue;
            }
            fn._ARE_CurrentDate = new Date();
            var interval = (fn._ARE_CurrentDate - fn._ARE_PrevDate) + (fn._ARE_CurrentDate - fn._ARE_LastDate);

            if (interval > fn._ARE_Interval) {
                fn();
                fn._ARE_PrevDate = fn._ARE_CurrentDate;
            }
            fn._ARE_LastDate = fn._ARE_CurrentDate;
        }
        if(this.autoUpdate)this.update();
        if (this.debug) {
            this.getFPS();
            this.debugDiv.innerHTML = "fps : " + this.fpsValue +  " <br/>object count : " + this.getTotalCount() + " <br/>rendering mode : " + this.getRenderingMode() + " <br/>inner object count  : " + this.stageRenderer.objs.length;
        }
    },
    "onTick": function(fn,interval) {
        this.tickFns.push(fn);
        if (interval !== undefined) {
            fn._ARE_PrevDate = new Date();
            fn._ARE_CurrentDate = new Date();
            fn._ARE_LastDate = new Date();
            fn._ARE_Interval = interval;
        }
    },
    "setFPS": function(fps) {
        this.interval = Math.floor(1e3 / fps);
    },
    "onKeyboard": function(keyCombo, onDownCallback, onUpCallback) {
        AlloyPaper.Keyboard.on(keyCombo, onDownCallback, onUpCallback);
    },
    "getActiveKeys": function() {
        return AlloyPaper.Keyboard.getActiveKeys();
    },
    "scaleToScreen": function (scaleX, scaleY) {
        this.scaleType = "screen";
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
        this.offset = this._getXY(this.canvas);
        this.style=this._getStyle();
    },
    "scaleToBox": function (w, h) {
        this.scaleType = "box";
        if (w === window.innerWidth && h === window.innerHeight) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        }
        var canvas = this.canvas;
        canvas.style.position = "absolute";
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        canvas.style.left = (window.innerWidth - w) / 2 + "px";
        canvas.style.top = (window.innerHeight - h) / 2 + "px";
        canvas.style.border = "0px solid #ccc";
        this.offset = this._getXY(this.canvas);
        this.style=this._getStyle();
    },
    "correctingXY": function (x, y) {
        if (this.scaleType === "box") {
            return {
                x: x * this.width / parseInt( this.canvas.style.width),
                y: y * this.height / parseInt(this.canvas.style.height)
            };
        } else {
            return {
                x: x * this.width / (window.innerWidth * this._scaleX),
                y: y * this.height / (window.innerHeight * this._scaleY)
            };
        }
    },
    "getTotalCount": function() {
        var count = 0;
        var self = this;

        function getCount(child) {
            if (child.baseInstanceof == "Container" || child.baseInstanceof == "Stage") {
                for (var i = 0, len = child.children.length; i < len; i++) {
                    var subChild = child.children[i];
                    if (subChild instanceof AlloyPaper.Container) {
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
        if (this.stageRenderer.renderingEngine instanceof AlloyPaper.CanvasRenderer) {
            return "Canvas";
        }
        return "WebGL";
    },
    "getFPS": function() {
       // var fps = AlloyPaper.FPS.get();
       // this.fpsValue = fps.value;
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
    },
    "_setCursorByOverObject": function (obj) {
        if (obj.cursor !== "default") {
            this.setCursor(obj.cursor);
        } else {
            if (obj.parent) {
                this._setCursorByOverObject(obj.parent);
            }
        }
    },
    "destroy": function () {
        this._super();
        this.canvas.parentNode.removeChild(this.canvas);
        if (this.useRequestAnimFrame) {
            AlloyPaper.RAF.clearRequestInterval(this.loop);
        } else {
            clearInterval(this.loop);
        }
    },
    "_getStyle":function() {
        var style = window.getComputedStyle(this.canvas, null);
        return {
            boxSizing: style.boxSizing,
            borderTopWidth: parseInt(style.borderTopWidth),
            borderLeftWidth: parseInt(style.borderLeftWidth),
            width:parseInt(style.width),
            height:parseInt(style.height)
        };
    },
    "_correction":function(pageX,pageY){
        var x=pageX-this.offset[0]-this.style.borderLeftWidth,
            y=pageY-this.offset[1]-this.style.borderTopWidth,
            canvasWidth=this.style.width,
            canvasHeight=this.style.height;
        if(this.style.boxSizing==="border-box"){
            canvasWidth-=this.style.borderLeftWidth;
            canvasHeight-=this.style.borderTopWidth;
        }
        return {x: this.width*x/canvasWidth,y:this.height*y/canvasHeight};
    }
});


//begin-------------------AlloyPaper.Text---------------------begin

AlloyPaper.Text = AlloyPaper.DisplayObject.extend({
    "ctor": function(value, font, color) {
        this._super();
        this.value = value;
        this.font = font;
        this.color = color;
        this.textAlign = "left";
        this.textBaseline = "top";
    },
    "draw": function(ctx) {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign || "left";
        ctx.textBaseline = this.textBaseline || "top";
        ctx.fillText(this.value, 0, 0);
    },
    "clone": function() {
        var t = new AlloyPaper.Text(this.text, this.font, this.color);
        this.cloneProps(t);
        return t;
    },
    "getWidth": function () {
        var measureCtx = document.createElement("canvas").getContext("2d");
        measureCtx.font = this.font;
        var width = measureCtx.measureText(this.value).width;
        measureCtx = null;
        return width;
    }
});

//end-------------------AlloyPaper.Text---------------------end


return AlloyPaper;
}));