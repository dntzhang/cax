class DisplayObject{
    constructor(){
        this.alpha = this.scaleX = this.scaleY = 1
        this.x = this.y = this.rotation = this.originX = this.originY = this.skewX = this.skewY = this.regX = this.regY = 0
        this.cursor = "default"
    }
}

export default DisplayObject;

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