/* Alloy Game Engine
 * By AlloyTeam http://www.alloyteam.com/
 * Github: https://github.com/AlloyTeam/AlloyGameEngine
 * MIT Licensed.
 */
; (function (win) {
    var initializing = !1, fnTest = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/, __class = function () { }; __class.extend = function (n) { function i() { !initializing && this.ctor && this.ctor.apply(this, arguments) } var f = this.prototype, u, r, t; initializing = !0, u = new this, initializing = !1; for (t in n) t != "statics" && (u[t] = typeof n[t] == "function" && typeof f[t] == "function" && fnTest.test(n[t]) ? function (n, t) { return function () { var r = this._super, i; return this._super = f[n], i = t.apply(this, arguments), this._super = r, i } }(t, n[t]) : n[t]); for (r in this) this.hasOwnProperty(r) && r != "extend" && (i[r] = this[r]); if (i.prototype = u, n.statics) for (t in n.statics) n.statics.hasOwnProperty(t) && (i[t] = n.statics[t], t == "ctor" && i[t]()); return i.prototype.constructor = i, i.extend = arguments.callee, i.implement = function (n) { for (var t in n) u[t] = n[t] }, i };

    ; (function () {
        var AlloyPaper = {};
        //begin-------------------AlloyPaper.CanvasRenderer---------------------begin

        AlloyPaper.CanvasRenderer = __class.extend({
            "ctor": function (stage) {
                if (stage) {
                    this.stage = stage;
                    this.ctx = stage.ctx;
                    this.height = stage.width;
                    this.width = stage.height;
                }
            },
            "update": function () {
                this.ctx.clearRect(0, 0, this.height, this.width);
                this.render(this.ctx, this.stage);
            },
            "render": function (ctx, o, mtx) {
                if (!o.isVisible()) {
                    return;
                }
                if (o instanceof AlloyPaper.DomElement) {
                    o.element.style.display = "block";
                    return;
                }
                if (mtx) {
                    o._matrix.reinitialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty, mtx.alpha, mtx.shadow, mtx.compositeOperation);
                } else {
                    o._matrix.reinitialize(1, 0, 0, 1, 0, 0);
                }
                mtx = o._matrix;
                if (o instanceof AlloyPaper.Sprite) {
                    o.regX = o.rect[2] * o.originX;
                    o.regY = o.rect[3] * o.originY;
                }
                mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY, o.filpX, o.flipY);
                var a = ctx.globalAlpha,
                    cp = ctx.globalCompositeOperation;
                ctx.globalAlpha *= o.alpha;
                ctx.globalCompositeOperation = o.compositeOperation;
                var mmyCanvas = o.cacheCanvas || o.txtCanvas;
                if (mmyCanvas) {
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                    ctx.drawImage(mmyCanvas, 0, 0);
                } else if (o instanceof AlloyPaper.Container || o instanceof AlloyPaper.Stage) {
                    var list = o.children.slice(0);
                    for (var i = 0, l = list.length; i < l; i++) {
                        ctx.save();
                        this.render(ctx, list[i], mtx);
                        ctx.restore();
                    }
                } else if (o instanceof AlloyPaper.Bitmap || o instanceof AlloyPaper.Sprite) {
                    var rect = o.rect;
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                    ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
                }
                ctx.globalAlpha = a;
                ctx.globalCompositeOperation = cp;
            },
            "hitRender": function (ctx, o, mtx, x, y, type) {
                ctx.clearRect(0, 0, 2, 2);
                if (mtx) {
                    o._matrix.reinitialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty, mtx.alpha, mtx.shadow, mtx.compositeOperation);
                } else {
                    o._matrix.reinitialize(1, 0, 0, 1, 0, 0);
                }
                mtx = o._matrix;
                mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY, o.filpX, o.flipY);
                var list = o.children.slice(0),
                    l = list.length;
                for (var i = l - 1; i >= 0; i--) {
                    var child = list[i];
                    mtx.reinitialize(1, 0, 0, 1, 0, 0);
                    mtx.appendTransform(o.x - x, o.y - y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY, o.filpX, o.flipY);
                    ctx.save();
                    var child = list[i];
                    this._hitRender(ctx, list[i], mtx, type);
                    ctx.restore();
                    if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
                        child.execEvent(type);
                        return child;
                    }
                }
            },
            "_hitRender": function (ctx, o, mtx, type) {
                if (!o.isVisible()) {
                    return;
                }
                if (mtx) {
                    o._matrix.reinitialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty, mtx.alpha, mtx.shadow, mtx.compositeOperation);
                } else {
                    o._matrix.reinitialize(1, 0, 0, 1, 0, 0);
                }
                mtx = o._matrix;
                mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY, o.filpX, o.flipY);
                var a = ctx.globalAlpha;
                ctx.globalAlpha *= o.alpha;
                if (o.cacheCanvas) {
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                    ctx.drawImage(o.cacheCanvas || o.img, 0, 0);
                } else if (o instanceof AlloyPaper.Container) {
                    var list = o.children.slice(0),
                        l = list.length;
                    for (var i = l - 1; i >= 0; i--) {
                        var child = list[i];
                        if (!this.isbindingEvent(child)) continue;
                        ctx.save();
                        this._hitRender(ctx, list[i], mtx);
                        ctx.restore();
                        if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
                            child.execEvent(type);
                        }
                    }
                } else if (o instanceof AlloyPaper.Bitmap || o instanceof AlloyPaper.Sprite) {
                    var rect = o.rect;
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                    ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
                }
                ctx.globalAlpha = a;
            },
            "isbindingEvent": function (obj) {
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
            "updateCache": function (ctx, o, w, h) {
                ctx.clearRect(0, 0, w + 1, h + 1);
                this.renderCache(ctx, o);
            },
            "renderCache": function (ctx, o) {
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
                }
            }
        });

        //end-------------------AlloyPaper.CanvasRenderer---------------------end

        //begin-------------------AlloyPaper.DisplayObject---------------------begin

        AlloyPaper.DisplayObject = __class.extend({
            "ctor": function () {
                this.alpha = this.scaleX = this.scaleY = 1;
                this.x = this.y = this.rotation = this.originX = this.originY = this.skewX = this.skewY = this.width = this.height = 0;
                this.flipX = this.flipY = false;
                this.visible = true;
                this._matrix = new AlloyPaper.Matrix2D();
                this.events = {};
                this.id = AlloyPaper.UID.get();
                this.cacheID = 0;
                this.baseInstanceof = "DisplayObject";
                var self = this;
                this._watch(this, "originX", function (prop, value) {
                    self.regX = self.width * value;
                });
                this._watch(this, "originY", function (prop, value) {
                    self.regY = self.height * value;
                });
            },
            "_watch": function (target, prop, onPropertyChanged) {
                var self = this,
                    currentValue = target["__" + prop] = this[prop];
                Object.defineProperty(target, prop, {
                    get: function () {
                        return this["__" + prop];
                    },
                    set: function (value) {
                        this["__" + prop] = value;
                        onPropertyChanged(prop, value);
                    }
                });
            },
            "isVisible": function () {
                return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
            },
            "on": function (type, fn) {
                ["mouseover", "mousemove", "mouseout", "touchstart", "touchmove", "touchend"].join("_").match(type) && (AlloyPaper.Stage.checkMove = true);
                this.events[type] || (this.events[type] = []);
                this.events[type].push(fn);
            },
            "execEvent": function (type) {
                var fns = this.events[type];
                this._fireFns(fns);
            },
            "hover": function (over, out) {
                this.on("mouseover", over);
                this.on("mouseout", out);
            },
            "_fireFns": function (fns) {
                if (fns) {
                    for (var i = 0, len = fns.length; i < len; i++) {
                        fns[i].call(this);
                    }
                }
            },
            "clone": function () {
                var o = new AlloyPaper.DisplayObject();
                this.cloneProps(o);
                return o;
            },
            "cloneProps": function (o) {
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
            "cache": function () {
                if (!this.cacheCanvas) {
                    this.cacheCanvas = document.createElement("canvas");
                    var bound = this.getBound();
                    this.cacheCanvas.width = bound.width;
                    this.cacheCanvas.height = bound.height;
                    this.cacheCtx = this.cacheCanvas.getContext("2d");
                }
                this.cacheID = AlloyPaper.UID.getCacheID();
                AlloyPaper.Stage.renderer.updateCache(this.cacheCtx, this, bound.width, bound.height);
            },
            "uncache": function () {
                this.cacheCanvas = null;
                this.cacheCtx = null;
                this.cacheID = null;
            },
            "getBound": function () {
                return {
                    width: this.width,
                    height: this.height
                };
            },
            "toCenter": function () {
                this.originX = .5;
                this.originY = .5;
                this.x = this.parent.width / 2;
                this.y = this.parent.height / 2;
            },
            "onClick": function (fn) {
                this.on("click", fn);
            },
            "onMouseMove": function (fn) {
                this.on("mousemove", fn);
            }
        });

        //end-------------------AlloyPaper.DisplayObject---------------------end

        //begin-------------------AlloyPaper.CircleShape---------------------begin

        AlloyPaper.CircleShape = AlloyPaper.DisplayObject.extend({
            "ctor": function (r, color, isHollow) {
                this._super();
                this.r = r || 1;
                this.color = color || "black";
                this.isHollow = isHollow;
                this.width = this.height = 2 * r;
                this.draw();
            },
            "draw": function (ctx) {
                this.cache();
                var ctx = this.cacheCtx;
                ctx.beginPath();
                ctx.arc(this.r, this.r, this.r, 0, Math.PI * 2);
                this.originX = this.originY = .5;
                this.isHollow ? (ctx.strokeStyle = this.color, ctx.stroke()) : (ctx.fillStyle = this.color, ctx.fill());
            }
        });

        //end-------------------AlloyPaper.CircleShape---------------------end

        //begin-------------------AlloyPaper.Container---------------------begin

        AlloyPaper.Container = AlloyPaper.DisplayObject.extend({
            "ctor": function () {
                this._super();
                this.children = [];
                this.baseInstanceof = "Container";
            },
            "add": function (obj) {
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
            "remove": function (obj) {
                var len = arguments.length,
                    childLen = this.children.length;
                if (len > 1) {
                    for (var j = 0; j < len; j++) {
                        var currentObj = arguments[j];
                        for (var k = childLen; --k >= 0;) {
                            if (this.children[k].id == currentObj.id) {
                                currentObj.parent = null;
                                this.children.splice(k, 1);
                                break;
                            }
                        }
                    }
                } else {
                    for (var i = childLen; --i >= 0;) {
                        if (this.children[i].id == obj.id) {
                            obj.parent = null;
                            this.children.splice(i, 1);
                            break;
                        }
                    }
                }
            },
            "clone": function () {
                var o = new AlloyPaper.Container();
                this.cloneProps(o);
                var arr = o.children = [];
                for (var i = this.children.length - 1; i > -1; i--) {
                    var clone = this.children[i].clone();
                    arr.unshift(clone);
                }
                return o;
            },
            "removeAll": function () {
                var kids = this.children;
                while (kids.length) {
                    kids.pop().parent = null;
                }
            }
        });

        //end-------------------AlloyPaper.Container---------------------end

        //begin-------------------AlloyPaper.Bitmap---------------------begin

        AlloyPaper.Bitmap = AlloyPaper.DisplayObject.extend({
            "ctor": function (img) {
                this._super();
                if (arguments.length === 0) return;
                if (typeof img == "string") {
                    this._initWithSrc(img);
                } else {
                    this._init(img);
                }
            },
            "_initWithSrc": function (img) {
                var cacheImg = AlloyPaper.Bitmap[img];
                if (cacheImg) {
                    this._init(cacheImg);
                } else {
                    var self = this;
                    this.visible = false;
                    this.img = document.createElement("img");
                    this.img.onload = function () {
                        if (!self.rect) self.rect = [0, 0, self.img.width, self.img.height];
                        self.width = self.rect[2];
                        self.height = self.rect[3];
                        self.regX = self.width * self.originX;
                        self.regY = self.height * self.originY;
                        self.imgLoaded = true;
                        AlloyPaper.Bitmap[img] = self.img;
                        self.visible = true;
                        self.imageLoadHandle && self.imageLoadHandle();
                    };
                    this.img.src = img;
                }
            },
            "_init": function (img) {
                this.img = img;
                this.width = img.width;
                this.height = img.height;
                this.imgLoaded = true;
                var self = this;
                this._watch(this, "filter", function (prop, value) {
                    self.setFilter.apply(self, value);
                });
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
                this.rect = [0, 0, img.width, img.height];
            },
            "setFilter": function (r, g, b, a) {
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
            "useImage": function (img) {
                if (typeof img == "string") {
                    this._initWithSrc(img);
                } else {
                    this._init(img);
                    this.imageLoadHandle && this.imageLoadHandle();
                }
            },
            "onImageLoad": function (fn) {
                this.imageLoadHandle = fn;
            },
            "clone": function () {
                var o = new AlloyPaper.Bitmap(this.img);
                o.rect = this.rect.slice(0);
                this.cloneProps(o);
                return o;
            }
        });

        //end-------------------AlloyPaper.Bitmap---------------------end

        //begin-------------------AlloyPaper.Particle---------------------begin

        AlloyPaper.Particle = AlloyPaper.Bitmap.extend({
            "ctor": function (option) {
                this._super(option.texture);
                this.position = option.position;
                this.x = this.position.x;
                this.y = this.position.y;
                this.rotation = option.rotation || 0;
                this.velocity = option.velocity;
                this.acceleration = option.acceleration || new AlloyPaper.Vector2(0, 0);
                this.rotatingSpeed = option.rotatingSpeed || 0;
                this.rotatingAcceleration = option.rotatingAcceleration || 0;
                this.hideSpeed = option.hideSpeed || .01;
                this.zoomSpeed = option.hideSpeed || .01;
                this.isAlive = true;
                this.originX = 0.5;
                this.originY = 0.5;

                this.setFilter.apply(this, option.filter);
            },
            "tick": function () {
                this.velocity.add(this.acceleration);
                this.position.add(this.velocity.multiply(.1));
                this.rotatingSpeed += this.rotatingAcceleration;
                this.rotation += this.rotatingSpeed;
                this.alpha -= this.hideSpeed;
                this.x = this.position.x;
                this.y = this.position.y;
                this.alpha = this.alpha;
            }
        });

        //end-------------------AlloyPaper.Particle---------------------end

        //begin-------------------AlloyPaper.DomElement---------------------begin

        AlloyPaper.DomElement = AlloyPaper.DisplayObject.extend({
            "ctor": function (selector) {
                this._super();
                this.element = typeof selector == "string" ? document.querySelector(selector) : selector;
                var element = this.element;
                var observer = AlloyPaper.Observable.watch(this, ["x", "y", "scaleX", "scaleY", "perspective", "rotation", "skewX", "skewY", "regX", "regY"]);
                var self = this;
                observer.propertyChangedHandler = function () {
                    var mtx = self._matrix.identity().appendTransform(self.x, self.y, self.scaleX, self.scaleY, self.rotation, self.skewX, self.skewY, self.regX, self.regY);
                    self.element.style.transform = self.element.style.msTransform = self.element.style.OTransform = self.element.style.MozTransform = self.element.style.webkitTransform = "matrix(" + mtx.a + "," + mtx.b + "," + mtx.c + "," + mtx.d + "," + mtx.tx + "," + mtx.ty + ")";
                };
                delete this.visible;
                Object.defineProperty(this, "visible", {
                    set: function (value) {
                        this._visible = value;
                        if (this._visible) {
                            this.element.style.display = "block";
                        } else {
                            this.element.style.display = "none";
                        }
                    },
                    get: function () {
                        return this._visible;
                    }
                });
                delete this.alpha;
                Object.defineProperty(this, "alpha", {
                    set: function (value) {
                        this._opacity = value;
                        this.element.style.opacity = value;
                    },
                    get: function () {
                        return this._opacity;
                    }
                });
                this.visible = true;
                this.alpha = 1;
                this.element.style.display = "none";
            },
            "isVisible": function () {
                return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
            }
        });

        //end-------------------AlloyPaper.DomElement---------------------end

        //begin-------------------AlloyPaper.ParticleSystem---------------------begin

        AlloyPaper.ParticleSystem = AlloyPaper.Container.extend({
            "ctor": function (option) {
                this._super();
                this.speed = option.speed;
                this.angle = option.angle;
                this.angleRange = option.angleRange;
                this.emitArea = option.emitArea;
                this.gravity = option.gravity || {x:0,y:0};
                this.filter = option.filter;
                this.compositeOperation = "lighter";
                this.emitCount = option.emitCount;
                this.maxCount = option.maxCount || 100;
                this.emitX = option.emitX;
                this.emitY = option.emitY;
                this.textureReady = false,
                self = this;
                if (typeof option.texture === "string") {
                    var img = new Image();
                    img.onload = function () {
                        self.texture = img;
                        self.textureReady = true;
                    };
                    img.src = option.texture;
                } else {
                    this.textureReady = true;
                    this.texture = option.texture;
                }
                this.tickFPS = 60;
            },
            "emit": function () {
                var angle = (this.angle + AlloyPaper.Util.random(-this.angleRange / 2, this.angleRange / 2)) * Math.PI / 180;
                var particle = new AlloyPaper.Particle({
                    position: new AlloyPaper.Vector2(this.emitX + AlloyPaper.Util.random(0, this.emitArea[0]), this.emitY + AlloyPaper.Util.random(0, this.emitArea[1])),
                    velocity: new AlloyPaper.Vector2(this.speed * Math.cos(angle), this.speed * Math.sin(angle)),
                    texture: this.texture,
                    acceleration: this.gravity,
                    filter: this.filter
                });
                this.add(particle);
            },
            "tick": function () {
                if (this.textureReady) {
                    var len = this.children.length;
                    if (len < this.maxCount) {
                        for (var k = 0; k < this.emitCount; k++) {
                            this.emit();
                        }
                    }
                    for (var i = 0; i < len; i++) {
                        var item = this.children[i];
                        if (item.isVisible()) {
                            item.tick();
                        } else {
                            this.remove(item);
                            i--;
                            len--;
                        }
                    }
                }
            }
        });

        //end-------------------AlloyPaper.ParticleSystem---------------------end

        //begin-------------------AlloyPaper.RectAdjust---------------------begin

        AlloyPaper.RectAdjust = __class.extend({
            "ctor": function (option) {
                this.min = option.min;
                this.max = option.max;
                this.value = option.value;
                this.change = option.change;
                this.renderTo = option.renderTo;
                this.fillStyle = option.fillStyle;
                this.canvas = document.createElement("canvas");
                this.canvas.width = 140;
                this.canvas.height = 16;
                this.canvas.style.cssText = "border:1px solid black;";
                this.ctx = this.canvas.getContext("2d");
                this.renderTo.appendChild(this.canvas);
                this.render(160 * (this.value - this.min) / (this.max - this.min));
                this.offset = this.canvas.getBoundingClientRect();
                var self = this;
                var isMouseDown = false;
                this.canvas.addEventListener("mousedown", function (evt) {
                    isMouseDown = true;
                    var x = evt.pageX - self.offset.left;
                    var y = evt.pageY - self.offset.top;
                    self.value = self.min + (self.max - self.min) * x / 140;
                    if (self.value > self.max) self.value = self.max;
                    if (self.value < self.min) self.value = self.min;
                    self.change(self.value);
                    self.render(x);
                    evt.preventDefault();
                    evt.stopPropagation();
                }, false);
                this.canvas.addEventListener("mousemove", function (evt) {
                    if (isMouseDown) {
                        var x = evt.pageX - self.offset.left;
                        var y = evt.pageY - self.offset.top;
                        self.value = self.min + (self.max - self.min) * x / 140;
                        if (self.value > self.max) self.value = self.max;
                        if (self.value < self.min) self.value = self.min;
                        self.change(self.value);
                        self.render(x);
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                }, false);
                document.addEventListener("mouseup", function (evt) {
                    isMouseDown = false;
                }, false);
            },
            "render": function (x) {
                this.ctx.fillStyle = this.fillStyle;
                this.ctx.clearRect(0, 0, 500, 500);
                this.ctx.beginPath();
                this.ctx.fillRect(0, 0, x, 60);
            }
        });

        //end-------------------AlloyPaper.RectAdjust---------------------end

        //begin-------------------AlloyPaper.RectShape---------------------begin

        AlloyPaper.RectShape = AlloyPaper.DisplayObject.extend({
            "ctor": function (width, height, color, isHollow) {
                this._super();
                this.color = color || "black";
                this.isHollow = isHollow;
                this.width = width;
                this.height = height;
                this.originX = this.originY = .5;
                this.draw();
            },
            "draw": function (ctx) {
                this.cache();
                var ctx = this.cacheCtx;
                ctx.beginPath();
                ctx.arc(this.r, this.r, this.r, 0, Math.PI * 2);
                this.isHollow ? (ctx.strokeStyle = this.color, ctx.strokeRect(0, 0, this.width, this.height)) : (ctx.fillStyle = this.color, ctx.fillRect(0, 0, this.width, this.height));
            }
        });

        //end-------------------AlloyPaper.RectShape---------------------end

        //begin-------------------AlloyPaper.Shape---------------------begin

        AlloyPaper.Shape = AlloyPaper.DisplayObject.extend({
            "ctor": function (width, height, debug) {
                this._super();
                this.cmds = [];
                this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];
                this.width = width;
                this.height = height;
                if (debug) {
                    this.fillStyle("red");
                    this.fillRect(0, 0, width, height);
                }
                this.cache();
            },
            "end": function () {
                var ctx = this.cacheCtx;
                for (var i = 0, len = this.cmds.length; i < len; i++) {
                    var cmd = this.cmds[i];
                    if (this.assMethod.join("-").match(new RegExp("\\b" + cmd[0] + "\\b", "g"))) {
                        ctx[cmd[0]] = cmd[1][0];
                    } else {
                        ctx[cmd[0]].apply(ctx, Array.prototype.slice.call(cmd[1]));
                    }
                }
            },
            "strokeRect": function () {
                this.cmds.push(["strokeRect", arguments]);
                return this;
            },
            "fillRect": function () {
                this.cmds.push(["fillRect", arguments]);
                return this;
            },
            "beginPath": function () {
                this.cmds.push(["beginPath", arguments]);
                return this;
            },
            "arc": function () {
                this.cmds.push(["arc", arguments]);
                return this;
            },
            "closePath": function () {
                this.cmds.push(["closePath", arguments]);
                return this;
            },
            "fillStyle": function () {
                this.cmds.push(["fillStyle", arguments]);
                return this;
            },
            "fill": function () {
                this.cmds.push(["fill", arguments]);
                return this;
            },
            "strokeStyle": function () {
                this.cmds.push(["strokeStyle", arguments]);
                return this;
            },
            "lineWidth": function () {
                this.cmds.push(["lineWidth", arguments]);
                return this;
            },
            "stroke": function () {
                this.cmds.push(["stroke", arguments]);
                return this;
            },
            "moveTo": function () {
                this.cmds.push(["moveTo", arguments]);
                return this;
            },
            "lineTo": function () {
                this.cmds.push(["lineTo", arguments]);
                return this;
            },
            "bezierCurveTo": function () {
                this.cmds.push(["bezierCurveTo", arguments]);
                return this;
            },
            "clone": function () { }
        });

        //end-------------------AlloyPaper.Shape---------------------end

        //begin-------------------AlloyPaper.Sprite---------------------begin

        AlloyPaper.Sprite = AlloyPaper.DisplayObject.extend({
            "ctor": function (option) {
                this._super();
                this.option = option;
                this.x = option.x || 0;
                this.y = option.y || 0;
                this.currentFrameIndex = 0;
                this.animationFrameIndex = 0;
                this.currentAnimation = option.currentAnimation || null;
                this.rect = [0, 0, 10, 10];
                this.visible = false;
                this.bitmaps = [],
                this._loadedCount = 0,
                self = this;
                for (var i = 0, len = this.option.imgs.length; i < len; i++) {
                    var bmp = new AlloyPaper.Bitmap();
                    bmp._sprite = this;
                    bmp.onImageLoad(function () {
                        bmp._sprite._loadedCount++;
                        if (bmp._sprite._loadedCount === len) {
                            bmp._sprite.visible = true;
                            delete bmp._sprite;
                        }
                    });
                    bmp.useImage(this.option.imgs[i]);
                    this.bitmaps.push(bmp);
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
            "play": function () {
                this.paused = false;
            },
            "stop": function () {
                this.paused = true;
            },
            "reset": function () {
                this.currentFrameIndex = 0;
                this.animationFrameIndex = 0;
            },
            "gotoAndPlay": function (animation, times) {
                this.paused = false;
                this.reset();
                clearInterval(this.loop);
                this.currentAnimation = animation;
                var self = this;
                var playTimes = 0;
                this.loop = setInterval(function () {
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
                        if (self.rect.length > 4) self.img = self.bitmaps[self.rect[4]].img;
                    }
                }, this.interval);
            },
            "gotoAndStop": function (animation) {
                this.reset();
                clearInterval(this.loop);
                var self = this;
                self.currentAnimation = animation;
                var opt = self.option;
                var frames = opt.animations[self.currentAnimation].frames,
                    len = frames.length;
                self.rect = opt.frames[frames[self.animationFrameIndex]];
                if (self.rect.length > 4) self.img = self.bitmaps[self.rect[4]].img;
            }
        });

        //end-------------------AlloyPaper.Sprite---------------------end

        //begin-------------------AlloyPaper.Text---------------------begin

        AlloyPaper.Text = AlloyPaper.DisplayObject.extend({
            "ctor": function (option) {
                this._super();
                this.txt = option.txt;
                this.fontSize = option.fontSize;
                this.fontFamily = option.fontFamily;
                this.color = option.color;
                this.textAlign = "center";
                this.textBaseline = "top";
                this.maxWidth = option.maxWidth || 2e3;
                this.square = option.square || false;
                var drawOption = this.getDrawOption({
                    txt: this.txt,
                    maxWidth: this.maxWidth,
                    square: this.square,
                    size: this.fontSize,
                    alignment: this.textAlign,
                    color: this.color || "black",
                    fontFamily: this.fontFamily
                });
            },
            "getDrawOption": function (option) {
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
                var backgroundColour = option.backgroundColour;
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
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
                ctx.font = textHeight + "px " + fontFamily;
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
                this.txtCanvas = canvas;
                return option;
            },
            "getPowerOfTwo": function (value, pow) {
                var pow = pow || 1;
                while (pow < value) {
                    pow *= 2;
                }
                return pow;
            },
            "measureText": function (ctx, textToMeasure) {
                return ctx.measureText(textToMeasure).width;
            },
            "createMultilineText": function (ctx, textToWrite, maxWidth, text) {
                textToWrite = textToWrite.replace("\n", " ");
                var currentText = textToWrite;
                var futureText;
                var subWidth = 0;
                var maxLineWidth = 0;
                var wordArray = textToWrite.split(" ");
                var wordsInCurrent, wordArrayLength;
                wordsInCurrent = wordArrayLength = wordArray.length;
                while (this.measureText(ctx, currentText) > maxWidth && wordsInCurrent > 1) {
                    wordsInCurrent--;
                    var linebreak = false;
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
            "draw": function (ctx) {
                ctx.fillStyle = this.color;
                ctx.font = this.font;
                ctx.textAlign = this.textAlign || "left";
                ctx.textBaseline = this.textBaseline || "top";
                ctx.fillText(this.text, 0, 0);
            },
            "clone": function () {
                var t = new AlloyPaper.Text(this.text, this.font, this.color);
                this.cloneProps(t);
                return t;
            }
        });

        //end-------------------AlloyPaper.Text---------------------end

        //begin-------------------AlloyPaper.Dom---------------------begin

        AlloyPaper.Dom = __class.extend({
            "statics": {
                "get": function (selector) {
                    this.element = document.querySelector(selector);
                    return this;
                },
                "on": function (type, fn) {
                    this.element.addEventListener(type, fn, false);
                    return this;
                }
            }
        });

        //end-------------------AlloyPaper.Dom---------------------end

        //begin-------------------AlloyPaper.Stage---------------------begin

        AlloyPaper.Stage = AlloyPaper.Container.extend({
            "statics": {
                "checkMove": false
            },
            "ctor": function (canvas, closegl) {
                this._super();
                this.canvas = typeof canvas == "string" ? document.querySelector(canvas) : canvas;
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                var canvasSupport = !!window.CanvasRenderingContext2D,
                    webglSupport = function () {
                        try {
                            var canvas = document.createElement("canvas");
                            return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
                        } catch (e) {
                            return false;
                        }
                    }();
                if (webglSupport && false) { } else {
                    this.ctx = this.canvas.getContext("2d");
                    this.renderer = new AlloyPaper.CanvasRenderer(this);
                }
                AlloyPaper.Stage.renderer = this.renderer;
                this.hitRenderer = new AlloyPaper.CanvasRenderer(this);
                this.hitCanvas = document.createElement("canvas");
                this.hitCanvas.width = 1;
                this.hitCanvas.height = 1;
                this.hitCtx = this.hitCanvas.getContext("2d");
                Function.prototype.bind = function () {
                    var __method = this;
                    var args = Array.prototype.slice.call(arguments);
                    var object = args.shift();
                    return function () {
                        return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
                    };
                };
                this._scaleX = this._scaleY = null;
                this.offset = this._getXY(this.canvas);
                this.overObj = null;
                this.pause = false;
                this.fps = 60;
                this.interval = Math.floor(1e3 / this.fps);
                var self = this;
                self.loop = setInterval(function () {
                    self._tick(self);
                }, self.interval);
                Object.defineProperty(this, "useRequestAnimFrame", {
                    set: function (value) {
                        this._useRequestAnimFrame = value;
                        if (value) {
                            clearInterval(self.loop);
                            self.loop = AlloyPaper.RAF.requestInterval(function () {
                                self._tick(self);
                            }, self.interval);
                        } else {
                            AlloyPaper.RAF.clearRequestInterval(self.loop);
                            self.loop = setInterval(function () {
                                self._tick(self);
                            }, self.interval);
                        }
                    },
                    get: function () {
                        return this._useRequestAnimFrame;
                    }
                });
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
                this.domSurface.addEventListener("mousemove", this._handleMouseMove.bind(this), false);
                this.domSurface.addEventListener("click", this._handleClick.bind(this), false);
                this.debugDiv = document.createElement("div");
                this.debugDiv.style.cssText = "display:none;position:absolute;z-index:1000;left:0;top:0;background-color:yellow;font-size:20px;";
                document.body.appendChild(this.debugDiv);
                Object.defineProperty(this, "debug", {
                    set: function (value) {
                        this._debug = value;
                        if (this._debug) {
                            this.debugDiv.style.display = "block";
                        } else {
                            this.debugDiv.style.display = "none";
                        }
                    },
                    get: function () {
                        return this._debug;
                    }
                });
            },
            "add": function (obj) {
                this._super.apply(this, arguments);
                var i, len = arguments.length;
                for (i = 0; i < len; i++) {
                    var obj = arguments[i];
                    if (obj instanceof AlloyPaper.DomElement) {
                        this.domSurface.appendChild(obj.element);
                    }
                }
            },
            "update": function () {
                if (!this.pause) {
                    this.renderer.update();
                }
            },
            "_handleClick": function (evt) {
                evt.stageX = evt.pageX - this.offset[0];
                evt.stageY = evt.pageY - this.offset[1];
                if (this._scaleX) {
                    var p = this.correctingXY(evt.stageX, evt.stageY);
                    evt.stageX = Math.round(p.x);
                    evt.stageY = Math.round(p.y);
                }
                var callbacks = this.events["click"];
                if (callbacks) {
                    for (var i = 0, len = callbacks.length; i < len; i++) {
                        var callback = callbacks[i];
                        callback(evt);
                    }
                }
                var child = this.hitRenderer.hitRender(this.hitCtx, this, null, evt.stageX, evt.stageY, "click");
            },
            "_handleMouseMove": function (evt) {
                evt.stageX = evt.pageX - this.offset[0];
                evt.stageY = evt.pageY - this.offset[1];
                if (this._scaleX) {
                    var p = this.correctingXY(evt.stageX, evt.stageY);
                    evt.stageX = Math.round(p.x);
                    evt.stageY = Math.round(p.y);
                }
                var callbacks = this.events["mousemove"];
                if (callbacks) {
                    for (var i = 0, len = callbacks.length; i < len; i++) {
                        var callback = callbacks[i];
                        callback(evt);
                    }
                }
            },
            "_getXY": function (el) {
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
            "destroy": function () { },
            "_tick": function (container) {
                if (container.tick) {
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
                    if (child.tick) {
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
            },
            "_initInterval": function (obj) {
                if (obj.hasOwnProperty("tickFPS")) {
                    if (obj.tickFPS == 0) {
                        obj._tickInterval = 1e4;
                    } else {
                        obj._tickInterval = 1e3 / obj.tickFPS;
                    }
                }
            },
            "tick": function (fn) {
                this.tickFn && this.tickFn();
                this.update();
                if (this.debug) {
                    this.debugDiv.innerHTML = "fps : " + this.getFPS() + " <br/>object count : " + this.getTotalCount() + " <br/>rendering mode : " + this.getRenderingMode();
                }
            },
            "onTick": function (fn) {
                this.tickFn = fn;
            },
            "setFPS": function (fps) {
                this.interval = Math.floor(1e3 / fps);
            },
            "onKeyboard": function (keyCombo, onDownCallback, onUpCallback) {
                AlloyPaper.Keyboard.on(keyCombo, onDownCallback, onUpCallback);
            },
            "getActiveKeys": function () {
                return AlloyPaper.Keyboard.getActiveKeys();
            },
            "scalable": function (scaleX, scaleY) {
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
                domSurface.style.position = "absolute";
                domSurface.style.width = scaleX * 100 + "%";
                domSurface.style.height = scaleY * 100 + "%";
                domSurface.style.left = 100 * (1 - scaleX) / 2 + "%";
                domSurface.style.top = 100 * (1 - scaleY) / 2 + "%";
                domSurface.style.border = "0px solid #ccc";
                domSurface.style.transform = domSurface.style.msTransform = domSurface.style.OTransform = domSurface.style.MozTransform = domSurface.style.webkitTransform = "scale(" + window.innerWidth * this._scaleX / this.width + "," + window.innerHeight * this._scaleX / this.height + ")";
                this.offset = this._getXY(this.canvas);
            },
            "correctingXY": function (x, y) {
                return {
                    x: x * this.width / (window.innerWidth * this._scaleX),
                    y: y * this.height / (window.innerHeight * this._scaleY)
                };
            },
            "getTotalCount": function () {
                var count = 0;

                function getCount(child) {
                    if (child.baseInstanceof == "Container") {
                        for (var i = 0, len = child.children.length; i < len; i++) {
                            if (child.children[i].baseInstanceof == "Container") {
                                getCount(child.children[i]);
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
            "getRenderingMode": function () {
                if (this.renderer instanceof AlloyPaper.CanvasRenderer) {
                    return "Canvas";
                }
                return "WebGL";
            },
            "getFPS": function () {
                return AlloyPaper.FPS.get();
            }
        });

        //end-------------------AlloyPaper.Stage---------------------end

        //begin-------------------AlloyPaper.FPS---------------------begin

        AlloyPaper.FPS = __class.extend({
            "statics": {
                "get": function () {
                    if (!this.instance) this.instance = new this();
                    this.instance._computeFPS();
                    return this.instance.value;
                }
            },
            "ctor": function () {
                this.last = new Date();
                this.current = null;
                this.value = 0;
                this.fpsList = [];
                var self = this;
                setInterval(function () {
                    var lastIndex = self.fpsList.length - 1;
                    self.value = self.fpsList[lastIndex];
                    if (lastIndex > 500) {
                        self.fpsList.shift();
                    }
                }, 500);
            },
            "_computeFPS": function () {
                this.current = new Date();
                this.fpsList.push(parseInt(1e3 / (this.current - this.last)));
                this.last = this.current;
            }
        });

        //end-------------------AlloyPaper.FPS---------------------end

        //begin-------------------AlloyPaper.Keyboard---------------------begin

        AlloyPaper.Keyboard = __class.extend({
            "statics": {
                "ctor": function () {
                    var KeyboardJS = {},
                        locales = {},
                        locale, map, macros, activeKeys = [],
                        bindings = [],
                        activeBindings = [],
                        activeMacros = [],
                        aI, usLocale;
                    usLocale = {
                        map: {
                            "3": ["cancel"],
                            "8": ["backspace"],
                            "9": ["tab"],
                            "12": ["clear"],
                            "13": ["enter"],
                            "16": ["shift"],
                            "17": ["ctrl"],
                            "18": ["alt", "menu"],
                            "19": ["pause", "break"],
                            "20": ["capslock"],
                            "27": ["escape", "esc"],
                            "32": ["space", "spacebar"],
                            "33": ["pageup"],
                            "34": ["pagedown"],
                            "35": ["end"],
                            "36": ["home"],
                            "37": ["left"],
                            "38": ["up"],
                            "39": ["right"],
                            "40": ["down"],
                            "41": ["select"],
                            "42": ["printscreen"],
                            "43": ["execute"],
                            "44": ["snapshot"],
                            "45": ["insert", "ins"],
                            "46": ["delete", "del"],
                            "47": ["help"],
                            "91": ["command", "windows", "win", "super", "leftcommand", "leftwindows", "leftwin", "leftsuper"],
                            "92": ["command", "windows", "win", "super", "rightcommand", "rightwindows", "rightwin", "rightsuper"],
                            "145": ["scrolllock", "scroll"],
                            "186": ["semicolon", ";"],
                            "187": ["equal", "equalsign", "="],
                            "188": ["comma", ","],
                            "189": ["dash", "-"],
                            "190": ["period", "."],
                            "191": ["slash", "forwardslash", "/"],
                            "192": ["graveaccent", "`"],
                            "219": ["openbracket", "["],
                            "220": ["backslash", "\\"],
                            "221": ["closebracket", "]"],
                            "222": ["apostrophe", "'"],
                            "48": ["zero", "0"],
                            "49": ["one", "1"],
                            "50": ["two", "2"],
                            "51": ["three", "3"],
                            "52": ["four", "4"],
                            "53": ["five", "5"],
                            "54": ["six", "6"],
                            "55": ["seven", "7"],
                            "56": ["eight", "8"],
                            "57": ["nine", "9"],
                            "96": ["numzero", "num0"],
                            "97": ["numone", "num1"],
                            "98": ["numtwo", "num2"],
                            "99": ["numthree", "num3"],
                            "100": ["numfour", "num4"],
                            "101": ["numfive", "num5"],
                            "102": ["numsix", "num6"],
                            "103": ["numseven", "num7"],
                            "104": ["numeight", "num8"],
                            "105": ["numnine", "num9"],
                            "106": ["nummultiply", "num*"],
                            "107": ["numadd", "num+"],
                            "108": ["numenter"],
                            "109": ["numsubtract", "num-"],
                            "110": ["numdecimal", "num."],
                            "111": ["numdivide", "num/"],
                            "144": ["numlock", "num"],
                            "112": ["f1"],
                            "113": ["f2"],
                            "114": ["f3"],
                            "115": ["f4"],
                            "116": ["f5"],
                            "117": ["f6"],
                            "118": ["f7"],
                            "119": ["f8"],
                            "120": ["f9"],
                            "121": ["f10"],
                            "122": ["f11"],
                            "123": ["f12"]
                        },
                        macros: [["shift + `", ["tilde", "~"]], ["shift + 1", ["exclamation", "exclamationpoint", "!"]], ["shift + 2", ["at", "@"]], ["shift + 3", ["number", "#"]], ["shift + 4", ["dollar", "dollars", "dollarsign", "$"]], ["shift + 5", ["percent", "%"]], ["shift + 6", ["caret", "^"]], ["shift + 7", ["ampersand", "and", "&"]], ["shift + 8", ["asterisk", "*"]], ["shift + 9", ["openparen", "("]], ["shift + 0", ["closeparen", ")"]], ["shift + -", ["underscore", "_"]], ["shift + =", ["plus", "+"]], ["shift + (", ["opencurlybrace", "opencurlybracket", "{"]], ["shift + )", ["closecurlybrace", "closecurlybracket", "}"]], ["shift + \\", ["verticalbar", "|"]], ["shift + ;", ["colon", ":"]], ["shift + '", ["quotationmark", '"']], ["shift + !,", ["openanglebracket", "<"]], ["shift + .", ["closeanglebracket", ">"]], ["shift + /", ["questionmark", "?"]]]
                    };
                    for (aI = 65; aI <= 90; aI += 1) {
                        usLocale.map[aI] = String.fromCharCode(aI + 32);
                        usLocale.macros.push(["shift + " + String.fromCharCode(aI + 32) + ", capslock + " + String.fromCharCode(aI + 32), [String.fromCharCode(aI)]]);
                    }
                    registerLocale("us", usLocale);
                    getSetLocale("us");
                    enable();
                    KeyboardJS.enable = enable;
                    KeyboardJS.disable = disable;
                    KeyboardJS.activeKeys = getActiveKeys;
                    KeyboardJS.releaseKey = removeActiveKey;
                    KeyboardJS.pressKey = addActiveKey;
                    KeyboardJS.on = createBinding;
                    KeyboardJS.clear = removeBindingByKeyCombo;
                    KeyboardJS.clear.key = removeBindingByKeyName;
                    KeyboardJS.locale = getSetLocale;
                    KeyboardJS.locale.register = registerLocale;
                    KeyboardJS.macro = createMacro;
                    KeyboardJS.macro.remove = removeMacro;
                    KeyboardJS.key = {};
                    KeyboardJS.key.name = getKeyName;
                    KeyboardJS.key.code = getKeyCode;
                    KeyboardJS.combo = {};
                    KeyboardJS.combo.active = isSatisfiedCombo;
                    KeyboardJS.combo.parse = parseKeyCombo;
                    KeyboardJS.combo.stringify = stringifyKeyCombo;

                    function enable() {
                        if (window.addEventListener) {
                            window.document.addEventListener("keydown", keydown, false);
                            window.document.addEventListener("keyup", keyup, false);
                            window.addEventListener("blur", reset, false);
                            window.addEventListener("webkitfullscreenchange", reset, false);
                            window.addEventListener("mozfullscreenchange", reset, false);
                        } else if (window.attachEvent) {
                            window.document.attachEvent("onkeydown", keydown);
                            window.document.attachEvent("onkeyup", keyup);
                            window.attachEvent("onblur", reset);
                        }
                    }
                    function disable() {
                        reset();
                        if (window.removeEventListener) {
                            window.document.removeEventListener("keydown", keydown, false);
                            window.document.removeEventListener("keyup", keyup, false);
                            window.removeEventListener("blur", reset, false);
                            window.removeEventListener("webkitfullscreenchange", reset, false);
                            window.removeEventListener("mozfullscreenchange", reset, false);
                        } else if (window.detachEvent) {
                            window.document.detachEvent("onkeydown", keydown);
                            window.document.detachEvent("onkeyup", keyup);
                            window.detachEvent("onblur", reset);
                        }
                    }
                    function reset(event) {
                        activeKeys = [];
                        pruneMacros();
                        pruneBindings(event);
                    }
                    function keydown(event) {
                        var keyNames, keyName, kI;
                        keyNames = getKeyName(event.keyCode);
                        if (keyNames.length < 1) {
                            return;
                        }
                        event.isRepeat = false;
                        for (kI = 0; kI < keyNames.length; kI += 1) {
                            keyName = keyNames[kI];
                            if (getActiveKeys().indexOf(keyName) != -1) event.isRepeat = true;
                            addActiveKey(keyName);
                        }
                        executeMacros();
                        executeBindings(event);
                    }
                    function keyup(event) {
                        var keyNames, kI;
                        keyNames = getKeyName(event.keyCode);
                        if (keyNames.length < 1) {
                            return;
                        }
                        for (kI = 0; kI < keyNames.length; kI += 1) {
                            removeActiveKey(keyNames[kI]);
                        }
                        pruneMacros();
                        pruneBindings(event);
                    }
                    function getKeyName(keyCode) {
                        return map[keyCode] || [];
                    }
                    function getKeyCode(keyName) {
                        var keyCode;
                        for (keyCode in map) {
                            if (!map.hasOwnProperty(keyCode)) {
                                continue;
                            }
                            if (map[keyCode].indexOf(keyName) > -1) {
                                return keyCode;
                            }
                        }
                        return false;
                    }
                    function createMacro(combo, injectedKeys) {
                        if (typeof combo !== "string" && (typeof combo !== "object" || typeof combo.push !== "function")) {
                            throw new Error("Cannot create macro. The combo must be a string or array.");
                        }
                        if (typeof injectedKeys !== "object" || typeof injectedKeys.push !== "function") {
                            throw new Error("Cannot create macro. The injectedKeys must be an array.");
                        }
                        macros.push([combo, injectedKeys]);
                    }
                    function removeMacro(combo) {
                        var macro, mI;
                        if (typeof combo !== "string" && (typeof combo !== "object" || typeof combo.push !== "function")) {
                            throw new Error("Cannot remove macro. The combo must be a string or array.");
                        }
                        for (mI = 0; mI < macros.length; mI += 1) {
                            macro = macros[mI];
                            if (compareCombos(combo, macro[0])) {
                                removeActiveKey(macro[1]);
                                macros.splice(mI, 1);
                                break;
                            }
                        }
                    }
                    function executeMacros() {
                        var mI, combo, kI;
                        for (mI = 0; mI < macros.length; mI += 1) {
                            combo = parseKeyCombo(macros[mI][0]);
                            if (activeMacros.indexOf(macros[mI]) === -1 && isSatisfiedCombo(combo)) {
                                activeMacros.push(macros[mI]);
                                for (kI = 0; kI < macros[mI][1].length; kI += 1) {
                                    addActiveKey(macros[mI][1][kI]);
                                }
                            }
                        }
                    }
                    function pruneMacros() {
                        var mI, combo, kI;
                        for (mI = 0; mI < activeMacros.length; mI += 1) {
                            combo = parseKeyCombo(activeMacros[mI][0]);
                            if (isSatisfiedCombo(combo) === false) {
                                for (kI = 0; kI < activeMacros[mI][1].length; kI += 1) {
                                    removeActiveKey(activeMacros[mI][1][kI]);
                                }
                                activeMacros.splice(mI, 1);
                                mI -= 1;
                            }
                        }
                    }
                    function createBinding(keyCombo, keyDownCallback, keyUpCallback) {
                        var api = {},
                            binding, subBindings = [],
                            bindingApi = {},
                            kI, subCombo;
                        if (typeof keyCombo === "string") {
                            keyCombo = parseKeyCombo(keyCombo);
                        }
                        for (kI = 0; kI < keyCombo.length; kI += 1) {
                            binding = {};
                            subCombo = stringifyKeyCombo([keyCombo[kI]]);
                            if (typeof subCombo !== "string") {
                                throw new Error("Failed to bind key combo. The key combo must be string.");
                            }
                            binding.keyCombo = subCombo;
                            binding.keyDownCallback = [];
                            binding.keyUpCallback = [];
                            if (keyDownCallback) {
                                binding.keyDownCallback.push(keyDownCallback);
                            }
                            if (keyUpCallback) {
                                binding.keyUpCallback.push(keyUpCallback);
                            }
                            bindings.push(binding);
                            subBindings.push(binding);
                        }
                        api.clear = clear;
                        api.on = on;
                        return api;

                        function clear() {
                            var bI;
                            for (bI = 0; bI < subBindings.length; bI += 1) {
                                bindings.splice(bindings.indexOf(subBindings[bI]), 1);
                            }
                        }
                        function on(eventName) {
                            var api = {},
                                callbacks, cI, bI;
                            if (typeof eventName !== "string") {
                                throw new Error("Cannot bind callback. The event name must be a string.");
                            }
                            if (eventName !== "keyup" && eventName !== "keydown") {
                                throw new Error('Cannot bind callback. The event name must be a "keyup" or "keydown".');
                            }
                            callbacks = Array.prototype.slice.apply(arguments, [1]);
                            for (cI = 0; cI < callbacks.length; cI += 1) {
                                if (typeof callbacks[cI] === "function") {
                                    if (eventName === "keyup") {
                                        for (bI = 0; bI < subBindings.length; bI += 1) {
                                            subBindings[bI].keyUpCallback.push(callbacks[cI]);
                                        }
                                    } else if (eventName === "keydown") {
                                        for (bI = 0; bI < subBindings.length; bI += 1) {
                                            subBindings[bI].keyDownCallback.push(callbacks[cI]);
                                        }
                                    }
                                }
                            }
                            api.clear = clear;
                            return api;

                            function clear() {
                                var cI, bI;
                                for (cI = 0; cI < callbacks.length; cI += 1) {
                                    if (typeof callbacks[cI] === "function") {
                                        if (eventName === "keyup") {
                                            for (bI = 0; bI < subBindings.length; bI += 1) {
                                                subBindings[bI].keyUpCallback.splice(subBindings[bI].keyUpCallback.indexOf(callbacks[cI]), 1);
                                            }
                                        } else {
                                            for (bI = 0; bI < subBindings.length; bI += 1) {
                                                subBindings[bI].keyDownCallback.splice(subBindings[bI].keyDownCallback.indexOf(callbacks[cI]), 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    function removeBindingByKeyCombo(keyCombo) {
                        var bI, binding, keyName;
                        for (bI = 0; bI < bindings.length; bI += 1) {
                            binding = bindings[bI];
                            if (compareCombos(keyCombo, binding.keyCombo)) {
                                bindings.splice(bI, 1);
                                bI -= 1;
                            }
                        }
                    }
                    function removeBindingByKeyName(keyName) {
                        var bI, kI, binding;
                        if (keyName) {
                            for (bI = 0; bI < bindings.length; bI += 1) {
                                binding = bindings[bI];
                                for (kI = 0; kI < binding.keyCombo.length; kI += 1) {
                                    if (binding.keyCombo[kI].indexOf(keyName) > -1) {
                                        bindings.splice(bI, 1);
                                        bI -= 1;
                                        break;
                                    }
                                }
                            }
                        } else {
                            bindings = [];
                        }
                    }
                    function executeBindings(event) {
                        var bI, sBI, binding, bindingKeys, remainingKeys, cI, killEventBubble, kI, bindingKeysSatisfied, index, sortedBindings = [],
                            bindingWeight;
                        remainingKeys = [].concat(activeKeys);
                        for (bI = 0; bI < bindings.length; bI += 1) {
                            bindingWeight = extractComboKeys(bindings[bI].keyCombo).length;
                            if (!sortedBindings[bindingWeight]) {
                                sortedBindings[bindingWeight] = [];
                            }
                            sortedBindings[bindingWeight].push(bindings[bI]);
                        }
                        for (sBI = sortedBindings.length - 1; sBI >= 0; sBI -= 1) {
                            if (!sortedBindings[sBI]) {
                                continue;
                            }
                            for (bI = 0; bI < sortedBindings[sBI].length; bI += 1) {
                                binding = sortedBindings[sBI][bI];
                                bindingKeys = extractComboKeys(binding.keyCombo);
                                bindingKeysSatisfied = true;
                                for (kI = 0; kI < bindingKeys.length; kI += 1) {
                                    if (remainingKeys.indexOf(bindingKeys[kI]) === -1) {
                                        bindingKeysSatisfied = false;
                                        break;
                                    }
                                }
                                if (bindingKeysSatisfied && isSatisfiedCombo(binding.keyCombo)) {
                                    activeBindings.push(binding);
                                    for (kI = 0; kI < bindingKeys.length; kI += 1) {
                                        index = remainingKeys.indexOf(bindingKeys[kI]);
                                        if (index > -1) {
                                            remainingKeys.splice(index, 1);
                                            kI -= 1;
                                        }
                                    }
                                    for (cI = 0; cI < binding.keyDownCallback.length; cI += 1) {
                                        if (binding.keyDownCallback[cI](event, getActiveKeys(), binding.keyCombo) === false) {
                                            killEventBubble = true;
                                        }
                                    }
                                    if (killEventBubble === true) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }
                                }
                            }
                        }
                    }
                    function pruneBindings(event) {
                        var bI, cI, binding, killEventBubble;
                        for (bI = 0; bI < activeBindings.length; bI += 1) {
                            binding = activeBindings[bI];
                            if (isSatisfiedCombo(binding.keyCombo) === false) {
                                for (cI = 0; cI < binding.keyUpCallback.length; cI += 1) {
                                    if (binding.keyUpCallback[cI](event, getActiveKeys(), binding.keyCombo) === false) {
                                        killEventBubble = true;
                                    }
                                }
                                if (killEventBubble === true) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                                activeBindings.splice(bI, 1);
                                bI -= 1;
                            }
                        }
                    }
                    function compareCombos(keyComboArrayA, keyComboArrayB) {
                        var cI, sI, kI;
                        keyComboArrayA = parseKeyCombo(keyComboArrayA);
                        keyComboArrayB = parseKeyCombo(keyComboArrayB);
                        if (keyComboArrayA.length !== keyComboArrayB.length) {
                            return false;
                        }
                        for (cI = 0; cI < keyComboArrayA.length; cI += 1) {
                            if (keyComboArrayA[cI].length !== keyComboArrayB[cI].length) {
                                return false;
                            }
                            for (sI = 0; sI < keyComboArrayA[cI].length; sI += 1) {
                                if (keyComboArrayA[cI][sI].length !== keyComboArrayB[cI][sI].length) {
                                    return false;
                                }
                                for (kI = 0; kI < keyComboArrayA[cI][sI].length; kI += 1) {
                                    if (keyComboArrayB[cI][sI].indexOf(keyComboArrayA[cI][sI][kI]) === -1) {
                                        return false;
                                    }
                                }
                            }
                        }
                        return true;
                    }
                    function isSatisfiedCombo(keyCombo) {
                        var cI, sI, stage, kI, stageOffset = 0,
                            index, comboMatches;
                        keyCombo = parseKeyCombo(keyCombo);
                        for (cI = 0; cI < keyCombo.length; cI += 1) {
                            comboMatches = true;
                            stageOffset = 0;
                            for (sI = 0; sI < keyCombo[cI].length; sI += 1) {
                                stage = [].concat(keyCombo[cI][sI]);
                                for (kI = stageOffset; kI < activeKeys.length; kI += 1) {
                                    index = stage.indexOf(activeKeys[kI]);
                                    if (index > -1) {
                                        stage.splice(index, 1);
                                        stageOffset = kI;
                                    }
                                }
                                if (stage.length !== 0) {
                                    comboMatches = false;
                                    break;
                                }
                            }
                            if (comboMatches) {
                                return true;
                            }
                        }
                        return false;
                    }
                    function extractComboKeys(keyCombo) {
                        var cI, sI, kI, keys = [];
                        keyCombo = parseKeyCombo(keyCombo);
                        for (cI = 0; cI < keyCombo.length; cI += 1) {
                            for (sI = 0; sI < keyCombo[cI].length; sI += 1) {
                                keys = keys.concat(keyCombo[cI][sI]);
                            }
                        }
                        return keys;
                    }
                    function parseKeyCombo(keyCombo) {
                        var s = keyCombo,
                            i = 0,
                            op = 0,
                            ws = false,
                            nc = false,
                            combos = [],
                            combo = [],
                            stage = [],
                            key = "";
                        if (typeof keyCombo === "object" && typeof keyCombo.push === "function") {
                            return keyCombo;
                        }
                        if (typeof keyCombo !== "string") {
                            throw new Error('Cannot parse "keyCombo" because its type is "' + typeof keyCombo + '". It must be a "string".');
                        }
                        while (s.charAt(i) === " ") {
                            i += 1;
                        }
                        while (true) {
                            if (s.charAt(i) === " ") {
                                while (s.charAt(i) === " ") {
                                    i += 1;
                                }
                                ws = true;
                            } else if (s.charAt(i) === ",") {
                                if (op || nc) {
                                    throw new Error("Failed to parse key combo. Unexpected , at character index " + i + ".");
                                }
                                nc = true;
                                i += 1;
                            } else if (s.charAt(i) === "+") {
                                if (key.length) {
                                    stage.push(key);
                                    key = "";
                                }
                                if (op || nc) {
                                    throw new Error("Failed to parse key combo. Unexpected + at character index " + i + ".");
                                }
                                op = true;
                                i += 1;
                            } else if (s.charAt(i) === ">") {
                                if (key.length) {
                                    stage.push(key);
                                    key = "";
                                }
                                if (stage.length) {
                                    combo.push(stage);
                                    stage = [];
                                }
                                if (op || nc) {
                                    throw new Error("Failed to parse key combo. Unexpected > at character index " + i + ".");
                                }
                                op = true;
                                i += 1;
                            } else if (i < s.length - 1 && s.charAt(i) === "!" && (s.charAt(i + 1) === ">" || s.charAt(i + 1) === "," || s.charAt(i + 1) === "+")) {
                                key += s.charAt(i + 1);
                                op = false;
                                ws = false;
                                nc = false;
                                i += 2;
                            } else if (i < s.length && s.charAt(i) !== "+" && s.charAt(i) !== ">" && s.charAt(i) !== "," && s.charAt(i) !== " ") {
                                if (op === false && ws === true || nc === true) {
                                    if (key.length) {
                                        stage.push(key);
                                        key = "";
                                    }
                                    if (stage.length) {
                                        combo.push(stage);
                                        stage = [];
                                    }
                                    if (combo.length) {
                                        combos.push(combo);
                                        combo = [];
                                    }
                                }
                                op = false;
                                ws = false;
                                nc = false;
                                while (i < s.length && s.charAt(i) !== "+" && s.charAt(i) !== ">" && s.charAt(i) !== "," && s.charAt(i) !== " ") {
                                    key += s.charAt(i);
                                    i += 1;
                                }
                            } else {
                                i += 1;
                                continue;
                            }
                            if (i >= s.length) {
                                if (key.length) {
                                    stage.push(key);
                                    key = "";
                                }
                                if (stage.length) {
                                    combo.push(stage);
                                    stage = [];
                                }
                                if (combo.length) {
                                    combos.push(combo);
                                    combo = [];
                                }
                                break;
                            }
                        }
                        return combos;
                    }
                    function stringifyKeyCombo(keyComboArray) {
                        var cI, ccI, output = [];
                        if (typeof keyComboArray === "string") {
                            return keyComboArray;
                        }
                        if (typeof keyComboArray !== "object" || typeof keyComboArray.push !== "function") {
                            throw new Error("Cannot stringify key combo.");
                        }
                        for (cI = 0; cI < keyComboArray.length; cI += 1) {
                            output[cI] = [];
                            for (ccI = 0; ccI < keyComboArray[cI].length; ccI += 1) {
                                output[cI][ccI] = keyComboArray[cI][ccI].join(" + ");
                            }
                            output[cI] = output[cI].join(" > ");
                        }
                        return output.join(" ");
                    }
                    function getActiveKeys() {
                        return [].concat(activeKeys);
                    }
                    function addActiveKey(keyName) {
                        if (keyName.match(/\s/)) {
                            throw new Error("Cannot add key name " + keyName + " to active keys because it contains whitespace.");
                        }
                        if (activeKeys.indexOf(keyName) > -1) {
                            return;
                        }
                        activeKeys.push(keyName);
                    }
                    function removeActiveKey(keyName) {
                        var keyCode = getKeyCode(keyName);
                        if (keyCode === "91" || keyCode === "92") {
                            activeKeys = [];
                        } else {
                            activeKeys.splice(activeKeys.indexOf(keyName), 1);
                        }
                    }
                    function registerLocale(localeName, localeMap) {
                        if (typeof localeName !== "string") {
                            throw new Error("Cannot register new locale. The locale name must be a string.");
                        }
                        if (typeof localeMap !== "object") {
                            throw new Error("Cannot register " + localeName + " locale. The locale map must be an object.");
                        }
                        if (typeof localeMap.map !== "object") {
                            throw new Error("Cannot register " + localeName + " locale. The locale map is invalid.");
                        }
                        if (!localeMap.macros) {
                            localeMap.macros = [];
                        }
                        locales[localeName] = localeMap;
                    }
                    function getSetLocale(localeName) {
                        if (localeName) {
                            if (typeof localeName !== "string") {
                                throw new Error("Cannot set locale. The locale name must be a string.");
                            }
                            if (!locales[localeName]) {
                                throw new Error("Cannot set locale to " + localeName + " because it does not exist. If you would like to submit a " + localeName + " locale map for KeyboardJS please submit it at https://github.com/RobertWHurst/KeyboardJS/issues.");
                            }
                            map = locales[localeName].map;
                            macros = locales[localeName].macros;
                            locale = localeName;
                        }
                        return locale;
                    }
                    this.Keyboard = KeyboardJS;
                },
                "on": function (keyCombo, onDownCallback, onUpCallback) {
                    this.Keyboard.on(keyCombo, onDownCallback, onUpCallback);
                },
                "getActiveKeys": function () {
                    return this.Keyboard.activeKeys();
                }
            }
        });

        //end-------------------AlloyPaper.Keyboard---------------------end

        //begin-------------------AlloyPaper.Loader---------------------begin

        AlloyPaper.Loader = __class.extend({
            "ctor": function () {
                this.audios = {};
                this.res = {};
                this.loadedCount = 0;
                this.resCount = -1;
                this.FILE_PATTERN = /(\w+:\/{2})?((?:\w+\.){2}\w+)?(\/?[\S]+\/|\/)?([\w\-%\.]+)(?:\.)(\w+)?(\?\S+)?/i;
                this.ns = 3;
                this.sounds = [];
                for (var i = 0; i < this.ns; i++) this.sounds.push([]);
                this.playing = [];
                this.soundsCount = 0;
            },
            "get": function (id) {
                return this.res[id];
            },
            "loadRes": function (arr) {
                this.resCount = arr.length;
                for (var i = 0; i < arr.length; i++) {
                    if (this._getTypeByExtension(arr[i].src.match(this.FILE_PATTERN)[5]) == "audio") {
                        this.loadAudio(arr[i].id, arr[i].src);
                    } else {
                        this.loadImage(arr[i].id, arr[i].src);
                    }
                }
            },
            "loadImage": function (id, src) {
                var img = document.createElement("img");
                var self = this;
                img.onload = function () {
                    self._handleLoad(this, id);
                    img.onreadystatechange = null;
                };
                img.onreadystatechange = function () {
                    if (img.readyState == "loaded" || img.readyState == "complete") {
                        self._handleLoad(this, id);
                        img.onload = null;
                    }
                };
                img.onerror = function () { };
                img.src = src;
            },
            "loadAudio": function (id, src) {
                var tag = document.createElement("audio");
                tag.autoplay = false;
                this.res[id] = tag;
                tag.src = null;
                tag.preload = "auto";
                tag.onerror = function () { };
                tag.onstalled = function () { };
                var self = this;
                var _audioCanPlayHandler = function () {
                    self.playing[id] = 0;
                    for (var i = 0; i < self.ns; i++) {
                        self.sounds[i][id] = new Audio(src);
                    }
                    self.loadedCount++;
                    self.handleProgress(self.loadedCount, self.resCount);
                    self._clean(this);
                    this.removeEventListener && this.removeEventListener("canplaythrough", _audioCanPlayHandler, false);
                    self.checkComplete();
                };
                tag.addEventListener("canplaythrough", _audioCanPlayHandler, false);
                tag.src = src;
                if (tag.load != null) {
                    tag.load();
                }
            },
            "checkComplete": function () {
                if (this.loadedCount === this.resCount) {
                    this.handleComplete();
                }
            },
            "complete": function (fn) {
                this.handleComplete = fn;
            },
            "progress": function (fn) {
                this.handleProgress = fn;
            },
            "playSound": function (id) {
                this.sounds[this.playing[id]][id].play();
                ++this.playing[id];
                if (this.playing[id] >= this.ns) this.playing[id] = 0;
            },
            "_handleLoad": function (currentImg, id) {
                this._clean(currentImg);
                this.res[id] = currentImg;
                this.loadedCount++;
                if (this.handleProgress) this.handleProgress(this.loadedCount, this.resCount);
                this.checkComplete();
            },
            "_getTypeByExtension": function (extension) {
                switch (extension) {
                    case "jpeg":
                    case "jpg":
                    case "gif":
                    case "png":
                    case "webp":
                    case "bmp":
                        return "img";
                    case "ogg":
                    case "mp3":
                    case "wav":
                        return "audio";
                }
            },
            "_clean": function (tag) {
                tag.onload = null;
                tag.onstalled = null;
                tag.onprogress = null;
                tag.onerror = null;
            }
        });

        //end-------------------AlloyPaper.Loader---------------------end

        //begin-------------------AlloyPaper.Matrix2D---------------------begin

        AlloyPaper.Matrix2D = __class.extend({
            "statics": {
                "DEG_TO_RAD": 0.017453292519943295
            },
            "ctor": function (a, b, c, d, tx, ty) {
                this.a = a == null ? 1 : a;
                this.b = b || 0;
                this.c = c || 0;
                this.d = d == null ? 1 : d;
                this.tx = tx || 0;
                this.ty = ty || 0;
                return this;
            },
            "identity": function () {
                this.a = this.d = 1;
                this.b = this.c = this.tx = this.ty = 0;
                return this;
            },
            "appendTransform": function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY, flipX, flipY) {
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
                if (flipX) {
                    this.a *= -1;
                    this.c *= -1;
                }
                if (flipY) {
                    this.b *= -1;
                    this.d *= -1;
                }
                return this;
            },
            "append": function (a, b, c, d, tx, ty) {
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
            "reinitialize": function (a, k, b, d, c, f, h, i, j) {
                this.initialize(a, k, b, d, c, f);
                this.alpha = h || 1;
                this.shadow = i;
                this.compositeOperation = j;
                return this;
            },
            "initialize": function (a, k, b, d, c, f) {
                if (a != null) this.a = a;
                this.b = k || 0;
                this.c = b || 0;
                if (d != null) this.d = d;
                this.tx = c || 0;
                this.ty = f || 0;
                return this;
            }
        });

        //end-------------------AlloyPaper.Matrix2D---------------------end

        //begin-------------------AlloyPaper.Observable---------------------begin

        AlloyPaper.Observable = __class.extend({
            "statics": {
                "ctor": function () {
                    this.methods = ["concat", "every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "reverse", "shift", "slice", "some", "sort", "splice", "unshift", "valueOf"],
                    this.triggerStr = ["concat", "pop", "push", "reverse", "shift", "sort", "splice", "unshift"].join(",");
                },
                "type": function (obj) {
                    var typeStr = Object.prototype.toString.call(obj).split(" ")[1];
                    return typeStr.substr(0, typeStr.length - 1).toLowerCase();
                },
                "isArray": function (obj) {
                    return this.type(obj) == "array";
                },
                "isInArray": function (arr, item) {
                    for (var i = arr.length; --i > -1;) {
                        if (item === arr[i]) return true;
                    }
                    return false;
                },
                "isFunction": function (obj) {
                    return this.type(obj) == "function";
                },
                "watch": function (target, arr) {
                    return new this(target, arr);
                }
            },
            "ctor": function (target, arr) {
                for (var prop in target) {
                    if (target.hasOwnProperty(prop)) {
                        if (arr && AlloyPaper.Observable.isInArray(arr, prop) || !arr) {
                            this.watch(target, prop);
                        }
                    }
                }
                if (target.change) throw "naming conflicts��observable will extend 'change' method to your object .";
                var self = this;
                target.change = function (fn) {
                    self.propertyChangedHandler = fn;
                };
            },
            "onPropertyChanged": function (prop, value) {
                this.propertyChangedHandler && this.propertyChangedHandler(prop, value);
            },
            "mock": function (target) {
                var self = this;
                AlloyPaper.Observable.methods.forEach(function (item) {
                    target[item] = function () {
                        var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                        for (var cprop in this) {
                            if (this.hasOwnProperty(cprop) && cprop != "_super" && !AlloyPaper.Observable.isFunction(this[cprop])) {
                                self.watch(this, cprop);
                            }
                        }
                        if (new RegExp("\\b" + item + "\\b").test(AlloyPaper.Observable.triggerStr)) {
                            self.onPropertyChanged("array", item);
                        }
                        return result;
                    };
                });
            },
            "watch": function (target, prop) {
                if (prop.substr(0, 2) == "__") return;
                var self = this;
                if (AlloyPaper.Observable.isFunction(target[prop])) return;
                var currentValue = target["__" + prop] = target[prop];
                Object.defineProperty(target, prop, {
                    get: function () {
                        return this["__" + prop];
                    },
                    set: function (value) {
                        this["__" + prop] = value;
                        self.onPropertyChanged(prop, value);
                    }
                });
                if (AlloyPaper.Observable.isArray(target)) {
                    this.mock(target);
                }
                if (typeof currentValue == "object") {
                    if (AlloyPaper.Observable.isArray(currentValue)) {
                        this.mock(currentValue);
                    }
                    for (var cprop in currentValue) {
                        if (currentValue.hasOwnProperty(cprop) && cprop != "_super") {
                            this.watch(currentValue, cprop);
                        }
                    }
                }
            }
        });

        //end-------------------AlloyPaper.Observable---------------------end

        //begin-------------------AlloyPaper.RAF---------------------begin

        AlloyPaper.RAF = __class.extend({
            "statics": {
                "ctor": function () {
                    var requestAnimFrame = function () {
                        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                        function (callback, element) {
                            window.setTimeout(callback, 1e3 / 60);
                        };
                    }();
                    var requestInterval = function (fn, delay) {
                        if (!window.requestAnimationFrame && !window.webkitRequestAnimationFrame && !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && !window.oRequestAnimationFrame && !window.msRequestAnimationFrame) return window.setInterval(fn, delay);
                        var start = new Date().getTime(),
                            handle = new Object();

                        function loop() {
                            var current = new Date().getTime(),
                                delta = current - start;
                            if (delta >= delay) {
                                fn.call();
                                start = new Date().getTime();
                            }
                            handle.value = requestAnimFrame(loop);
                        }
                        handle.value = requestAnimFrame(loop);
                        return handle;
                    };
                    var clearRequestInterval = function (handle) {
                        if (handle) {
                            setTimeout(function () {
                                window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) : window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) : clearInterval(handle);
                            }, 0);
                        }
                    };
                    this.requestInterval = requestInterval;
                    this.clearRequestInterval = clearRequestInterval;
                }
            }
        });

        //end-------------------AlloyPaper.RAF---------------------end

        //begin-------------------AlloyPaper.TWEEN---------------------begin

        AlloyPaper.TWEEN = __class.extend({
            "statics": {
                "ctor": function () {
                    if (Date.now === undefined) {
                        Date.now = function () {
                            return new Date().valueOf();
                        };
                    }
                    this._tweens = [];
                },
                "REVISION": "14",
                "getAll": function () {
                    return this._tweens;
                },
                "removeAll": function () {
                    this._tweens = [];
                },
                "add": function (tween) {
                    this._tweens.push(tween);
                },
                "remove": function (tween) {
                    var i = this._tweens.indexOf(tween);
                    if (i !== -1) {
                        this._tweens.splice(i, 1);
                    }
                },
                "update": function (time) {
                    if (this._tweens.length === 0) return false;
                    var i = 0;
                    time = time !== undefined ? time : typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
                    while (i < this._tweens.length) {
                        if (this._tweens[i].update(time)) {
                            i++;
                        } else {
                            this._tweens.splice(i, 1);
                        }
                    }
                    return true;
                },
                "Tween": function (object) {
                    var _object = object;
                    var _valuesStart = {};
                    var _valuesEnd = {};
                    var _valuesStartRepeat = {};
                    var _duration = 1e3;
                    var _repeat = 0;
                    var _yoyo = false;
                    var _isPlaying = false;
                    var _reversed = false;
                    var _delayTime = 0;
                    var _startTime = null;
                    var _easingFunction = AlloyPaper.TWEEN.Easing.Linear.None;
                    var _interpolationFunction = AlloyPaper.TWEEN.Interpolation.Linear;
                    var _chainedTweens = [];
                    var _onStartCallback = null;
                    var _onStartCallbackFired = false;
                    var _onUpdateCallback = null;
                    var _onCompleteCallback = null;
                    var _onStopCallback = null;
                    var _paused = false,
                        _passTime = null;
                    for (var field in object) {
                        _valuesStart[field] = parseFloat(object[field], 10);
                    }
                    this.togglePlayPause = function () {
                        if (_paused) {
                            this.play();
                        } else {
                            this.pause();
                        }
                    },
                    this.pause = function () {
                        _paused = true;
                        var pauseTime = typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
                        _passTime = pauseTime - _startTime;
                    };
                    this.play = function () {
                        _paused = false;
                        var nowTime = typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
                        _startTime = nowTime - _passTime;
                    };
                    this.to = function (properties, duration) {
                        if (duration !== undefined) {
                            _duration = duration;
                        }
                        _valuesEnd = properties;
                        return this;
                    };
                    this.start = function (time) {
                        AlloyPaper.TWEEN.add(this);
                        _isPlaying = true;
                        _onStartCallbackFired = false;
                        _startTime = time !== undefined ? time : typeof window !== "undefined" && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now();
                        _startTime += _delayTime;
                        for (var property in _valuesEnd) {
                            if (_valuesEnd[property] instanceof Array) {
                                if (_valuesEnd[property].length === 0) {
                                    continue;
                                }
                                _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
                            }
                            _valuesStart[property] = _object[property];
                            if (_valuesStart[property] instanceof Array === false) {
                                _valuesStart[property] *= 1;
                            }
                            _valuesStartRepeat[property] = _valuesStart[property] || 0;
                        }
                        return this;
                    };
                    this.stop = function () {
                        if (!_isPlaying) {
                            return this;
                        }
                        AlloyPaper.TWEEN.remove(this);
                        _isPlaying = false;
                        if (_onStopCallback !== null) {
                            _onStopCallback.call(_object);
                        }
                        this.stopChainedTweens();
                        return this;
                    };
                    this.stopChainedTweens = function () {
                        for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                            _chainedTweens[i].stop();
                        }
                    };
                    this.delay = function (amount) {
                        _delayTime = amount;
                        return this;
                    };
                    this.repeat = function (times) {
                        _repeat = times;
                        return this;
                    };
                    this.yoyo = function (yoyo) {
                        _yoyo = yoyo;
                        return this;
                    };
                    this.easing = function (easing) {
                        _easingFunction = easing;
                        return this;
                    };
                    this.interpolation = function (interpolation) {
                        _interpolationFunction = interpolation;
                        return this;
                    };
                    this.chain = function () {
                        _chainedTweens = arguments;
                        return this;
                    };
                    this.onStart = function (callback) {
                        _onStartCallback = callback;
                        return this;
                    };
                    this.onUpdate = function (callback) {
                        _onUpdateCallback = callback;
                        return this;
                    };
                    this.onComplete = function (callback) {
                        _onCompleteCallback = callback;
                        return this;
                    };
                    this.onStop = function (callback) {
                        _onStopCallback = callback;
                        return this;
                    };
                    this.update = function (time) {
                        if (_paused) return true;
                        var property;
                        if (time < _startTime) {
                            return true;
                        }
                        if (_onStartCallbackFired === false) {
                            if (_onStartCallback !== null) {
                                _onStartCallback.call(_object);
                            }
                            _onStartCallbackFired = true;
                        }
                        var elapsed = (time - _startTime) / _duration;
                        elapsed = elapsed > 1 ? 1 : elapsed;
                        var value = _easingFunction(elapsed);
                        for (property in _valuesEnd) {
                            var start = _valuesStart[property] || 0;
                            var end = _valuesEnd[property];
                            if (end instanceof Array) {
                                _object[property] = _interpolationFunction(end, value);
                            } else {
                                if (typeof end === "string") {
                                    end = start + parseFloat(end, 10);
                                }
                                if (typeof end === "number") {
                                    _object[property] = start + (end - start) * value;
                                }
                            }
                        }
                        if (_onUpdateCallback !== null) {
                            _onUpdateCallback.call(_object, value);
                        }
                        if (elapsed == 1) {
                            if (_repeat > 0) {
                                if (isFinite(_repeat)) {
                                    _repeat--;
                                }
                                for (property in _valuesStartRepeat) {
                                    if (typeof _valuesEnd[property] === "string") {
                                        _valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
                                    }
                                    if (_yoyo) {
                                        var tmp = _valuesStartRepeat[property];
                                        _valuesStartRepeat[property] = _valuesEnd[property];
                                        _valuesEnd[property] = tmp;
                                    }
                                    _valuesStart[property] = _valuesStartRepeat[property];
                                }
                                if (_yoyo) {
                                    _reversed = !_reversed;
                                }
                                _startTime = time + _delayTime;
                                return true;
                            } else {
                                if (_onCompleteCallback !== null) {
                                    _onCompleteCallback.call(_object);
                                }
                                for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                                    _chainedTweens[i].start(time);
                                }
                                return false;
                            }
                        }
                        return true;
                    };
                },
                "Easing": {
                    "Linear": {
                        "None": function (k) {
                            return k;
                        }
                    },
                    "Quadratic": {
                        "In": function (k) {
                            return k * k;
                        },
                        "Out": function (k) {
                            return k * (2 - k);
                        },
                        "InOut": function (k) {
                            if ((k *= 2) < 1) return .5 * k * k;
                            return -.5 * (--k * (k - 2) - 1);
                        }
                    },
                    "Cubic": {
                        "In": function (k) {
                            return k * k * k;
                        },
                        "Out": function (k) {
                            return --k * k * k + 1;
                        },
                        "InOut": function (k) {
                            if ((k *= 2) < 1) return .5 * k * k * k;
                            return .5 * ((k -= 2) * k * k + 2);
                        }
                    },
                    "Quartic": {
                        "In": function (k) {
                            return k * k * k * k;
                        },
                        "Out": function (k) {
                            return 1 - --k * k * k * k;
                        },
                        "InOut": function (k) {
                            if ((k *= 2) < 1) return .5 * k * k * k * k;
                            return -.5 * ((k -= 2) * k * k * k - 2);
                        }
                    },
                    "Quintic": {
                        "In": function (k) {
                            return k * k * k * k * k;
                        },
                        "Out": function (k) {
                            return --k * k * k * k * k + 1;
                        },
                        "InOut": function (k) {
                            if ((k *= 2) < 1) return .5 * k * k * k * k * k;
                            return .5 * ((k -= 2) * k * k * k * k + 2);
                        }
                    },
                    "Sinusoidal": {
                        "In": function (k) {
                            return 1 - Math.cos(k * Math.PI / 2);
                        },
                        "Out": function (k) {
                            return Math.sin(k * Math.PI / 2);
                        },
                        "InOut": function (k) {
                            return .5 * (1 - Math.cos(Math.PI * k));
                        }
                    },
                    "Exponential": {
                        "In": function (k) {
                            return k === 0 ? 0 : Math.pow(1024, k - 1);
                        },
                        "Out": function (k) {
                            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
                        },
                        "InOut": function (k) {
                            if (k === 0) return 0;
                            if (k === 1) return 1;
                            if ((k *= 2) < 1) return .5 * Math.pow(1024, k - 1);
                            return .5 * (-Math.pow(2, -10 * (k - 1)) + 2);
                        }
                    },
                    "Circular": {
                        "In": function (k) {
                            return 1 - Math.sqrt(1 - k * k);
                        },
                        "Out": function (k) {
                            return Math.sqrt(1 - --k * k);
                        },
                        "InOut": function (k) {
                            if ((k *= 2) < 1) return -.5 * (Math.sqrt(1 - k * k) - 1);
                            return .5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
                        }
                    },
                    "Elastic": {
                        "In": function (k) {
                            var s, a = .1,
                                p = .4;
                            if (k === 0) return 0;
                            if (k === 1) return 1;
                            if (!a || a < 1) {
                                a = 1;
                                s = p / 4;
                            } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                            return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                        },
                        "Out": function (k) {
                            var s, a = .1,
                                p = .4;
                            if (k === 0) return 0;
                            if (k === 1) return 1;
                            if (!a || a < 1) {
                                a = 1;
                                s = p / 4;
                            } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                            return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
                        },
                        "InOut": function (k) {
                            var s, a = .1,
                                p = .4;
                            if (k === 0) return 0;
                            if (k === 1) return 1;
                            if (!a || a < 1) {
                                a = 1;
                                s = p / 4;
                            } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                            if ((k *= 2) < 1) return -.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                            return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * .5 + 1;
                        }
                    },
                    "Back": {
                        "In": function (k) {
                            var s = 1.70158;
                            return k * k * ((s + 1) * k - s);
                        },
                        "Out": function (k) {
                            var s = 1.70158;
                            return --k * k * ((s + 1) * k + s) + 1;
                        },
                        "InOut": function (k) {
                            var s = 1.70158 * 1.525;
                            if ((k *= 2) < 1) return .5 * (k * k * ((s + 1) * k - s));
                            return .5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
                        }
                    },
                    "Bounce": {
                        "In": function (k) {
                            return 1 - AlloyPaper.TWEEN.Easing.Bounce.Out(1 - k);
                        },
                        "Out": function (k) {
                            if (k < 1 / 2.75) {
                                return 7.5625 * k * k;
                            } else if (k < 2 / 2.75) {
                                return 7.5625 * (k -= 1.5 / 2.75) * k + .75;
                            } else if (k < 2.5 / 2.75) {
                                return 7.5625 * (k -= 2.25 / 2.75) * k + .9375;
                            } else {
                                return 7.5625 * (k -= 2.625 / 2.75) * k + .984375;
                            }
                        },
                        "InOut": function (k) {
                            if (k < .5) return AlloyPaper.TWEEN.Easing.Bounce.In(k * 2) * .5;
                            return AlloyPaper.TWEEN.Easing.Bounce.Out(k * 2 - 1) * .5 + .5;
                        }
                    }
                },
                "Interpolation": {
                    "Linear": function (v, k) {
                        var m = v.length - 1,
                            f = m * k,
                            i = Math.floor(f),
                            fn = AlloyPaper.TWEEN.Interpolation.Utils.Linear;
                        if (k < 0) return fn(v[0], v[1], f);
                        if (k > 1) return fn(v[m], v[m - 1], m - f);
                        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
                    },
                    "Bezier": function (v, k) {
                        var b = 0,
                            n = v.length - 1,
                            pw = Math.pow,
                            bn = AlloyPaper.TWEEN.Interpolation.Utils.Bernstein,
                            i;
                        for (i = 0; i <= n; i++) {
                            b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
                        }
                        return b;
                    },
                    "CatmullRom": function (v, k) {
                        var m = v.length - 1,
                            f = m * k,
                            i = Math.floor(f),
                            fn = AlloyPaper.TWEEN.Interpolation.Utils.CatmullRom;
                        if (v[0] === v[m]) {
                            if (k < 0) i = Math.floor(f = m * (1 + k));
                            return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
                        } else {
                            if (k < 0) return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
                            if (k > 1) return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
                            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
                        }
                    },
                    "Utils": {
                        "Linear": function (p0, p1, t) {
                            return (p1 - p0) * t + p0;
                        },
                        "Bernstein": function (n, i) {
                            var fc = AlloyPaper.TWEEN.Interpolation.Utils.getFactorial();
                            return fc(n) / fc(i) / fc(n - i);
                        },
                        "getFactorial": function () {
                            return function () {
                                var a = [1];
                                return function (n) {
                                    var s = 1,
                                        i;
                                    if (a[n]) return a[n];
                                    for (i = n; i > 1; i--) s *= i;
                                    return a[n] = s;
                                };
                            }();
                        },
                        "CatmullRom": function (p0, p1, p2, p3, t) {
                            var v0 = (p2 - p0) * .5,
                                v1 = (p3 - p1) * .5,
                                t2 = t * t,
                                t3 = t * t2;
                            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
                        }
                    }
                }
            }
        });

        //end-------------------AlloyPaper.TWEEN---------------------end

        //begin-------------------AlloyPaper.UID---------------------begin

        AlloyPaper.UID = __class.extend({
            "statics": {
                "_nextID": 0,
                "_nextCacheID": 1,
                "get": function () {
                    return this._nextID++;
                },
                "getCacheID": function () {
                    return this._nextCacheID++;
                }
            }
        });

        //end-------------------AlloyPaper.UID---------------------end

        //begin-------------------AlloyPaper.Util---------------------begin

        AlloyPaper.Util = __class.extend({
            "statics": {
                "random": function (min, max) {
                    return min + Math.floor(Math.random() * (max - min + 1));
                }
            }
        });

        //end-------------------AlloyPaper.Util---------------------end

        //begin-------------------AlloyPaper.Vector2---------------------begin

        AlloyPaper.Vector2 = __class.extend({
            "ctor": function (x, y) {
                this.x = x;
                this.y = y;
            },
            "copy": function () {
                return new AlloyPaper.Vector2(this.x, this.y);
            },
            "length": function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },
            "sqrLength": function () {
                return this.x * this.x + this.y * this.y;
            },
            "normalize": function () {
                var inv = 1 / this.length();
                return new AlloyPaper.Vector2(this.x * inv, this.y * inv);
            },
            "negate": function () {
                return new AlloyPaper.Vector2(-this.x, -this.y);
            },
            "add": function (v) {
                this.x += v.x,
                this.y += v.y;
            },
            "subtract": function (v) {
                return new AlloyPaper.Vector2(this.x - v.x, this.y - v.y);
            },
            "multiply": function (f) {
                return new AlloyPaper.Vector2(this.x * f, this.y * f);
            },
            "divide": function (f) {
                var invf = 1 / f;
                return new AlloyPaper.Vector2(this.x * invf, this.y * invf);
            },
            "dot": function (v) {
                return this.x * v.x + this.y * v.y;
            }
        });

        //end-------------------AlloyPaper.Vector2---------------------end
        if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = AlloyPaper }
        else if (typeof define === 'function' && define.amd) { define(AlloyPaper) }
        else { win.AlloyPaper = AlloyPaper };
    })();
})(Function('return this')());/* Blob.js
 * A Blob implementation.
 * 2014-07-24
 *
 * By Eli Grey, http://eligrey.com
 * By Devin Samarin, https://github.com/dsamarin
 * License: X11/MIT
 *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
 */

/*global self, unescape */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */

(function (view) {
    "use strict";

    view.URL = view.URL || view.webkitURL;

    if (view.Blob && view.URL) {
        try {
            new Blob;
            return;
        } catch (e) { }
    }

    // Internally we use a BlobBuilder implementation to base Blob off of
    // in order to support older browsers that only have BlobBuilder
    var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || (function (view) {
        var
			  get_class = function (object) {
			      return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
			  }
			, FakeBlobBuilder = function BlobBuilder() {
			    this.data = [];
			}
			, FakeBlob = function Blob(data, type, encoding) {
			    this.data = data;
			    this.size = data.length;
			    this.type = type;
			    this.encoding = encoding;
			}
			, FBB_proto = FakeBlobBuilder.prototype
			, FB_proto = FakeBlob.prototype
			, FileReaderSync = view.FileReaderSync
			, FileException = function (type) {
			    this.code = this[this.name = type];
			}
			, file_ex_codes = (
				  "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
				+ "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
			).split(" ")
			, file_ex_code = file_ex_codes.length
			, real_URL = view.URL || view.webkitURL || view
			, real_create_object_URL = real_URL.createObjectURL
			, real_revoke_object_URL = real_URL.revokeObjectURL
			, URL = real_URL
			, btoa = view.btoa
			, atob = view.atob

			, ArrayBuffer = view.ArrayBuffer
			, Uint8Array = view.Uint8Array

			, origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/
        ;
        FakeBlob.fake = FB_proto.fake = true;
        while (file_ex_code--) {
            FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
        }
        // Polyfill URL
        if (!real_URL.createObjectURL) {
            URL = view.URL = function (uri) {
                var
					  uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
					, uri_origin
                ;
                uri_info.href = uri;
                if (!("origin" in uri_info)) {
                    if (uri_info.protocol.toLowerCase() === "data:") {
                        uri_info.origin = null;
                    } else {
                        uri_origin = uri.match(origin);
                        uri_info.origin = uri_origin && uri_origin[1];
                    }
                }
                return uri_info;
            };
        }
        URL.createObjectURL = function (blob) {
            var
				  type = blob.type
				, data_URI_header
            ;
            if (type === null) {
                type = "application/octet-stream";
            }
            if (blob instanceof FakeBlob) {
                data_URI_header = "data:" + type;
                if (blob.encoding === "base64") {
                    return data_URI_header + ";base64," + blob.data;
                } else if (blob.encoding === "URI") {
                    return data_URI_header + "," + decodeURIComponent(blob.data);
                } if (btoa) {
                    return data_URI_header + ";base64," + btoa(blob.data);
                } else {
                    return data_URI_header + "," + encodeURIComponent(blob.data);
                }
            } else if (real_create_object_URL) {
                return real_create_object_URL.call(real_URL, blob);
            }
        };
        URL.revokeObjectURL = function (object_URL) {
            if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
                real_revoke_object_URL.call(real_URL, object_URL);
            }
        };
        FBB_proto.append = function (data/*, endings*/) {
            var bb = this.data;
            // decode data to a binary string
            if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
                var
					  str = ""
					, buf = new Uint8Array(data)
					, i = 0
					, buf_len = buf.length
                ;
                for (; i < buf_len; i++) {
                    str += String.fromCharCode(buf[i]);
                }
                bb.push(str);
            } else if (get_class(data) === "Blob" || get_class(data) === "File") {
                if (FileReaderSync) {
                    var fr = new FileReaderSync;
                    bb.push(fr.readAsBinaryString(data));
                } else {
                    // async FileReader won't work as BlobBuilder is sync
                    throw new FileException("NOT_READABLE_ERR");
                }
            } else if (data instanceof FakeBlob) {
                if (data.encoding === "base64" && atob) {
                    bb.push(atob(data.data));
                } else if (data.encoding === "URI") {
                    bb.push(decodeURIComponent(data.data));
                } else if (data.encoding === "raw") {
                    bb.push(data.data);
                }
            } else {
                if (typeof data !== "string") {
                    data += ""; // convert unsupported types to strings
                }
                // decode UTF-16 to binary string
                bb.push(unescape(encodeURIComponent(data)));
            }
        };
        FBB_proto.getBlob = function (type) {
            if (!arguments.length) {
                type = null;
            }
            return new FakeBlob(this.data.join(""), type, "raw");
        };
        FBB_proto.toString = function () {
            return "[object BlobBuilder]";
        };
        FB_proto.slice = function (start, end, type) {
            var args = arguments.length;
            if (args < 3) {
                type = null;
            }
            return new FakeBlob(
				  this.data.slice(start, args > 1 ? end : this.data.length)
				, type
				, this.encoding
			);
        };
        FB_proto.toString = function () {
            return "[object Blob]";
        };
        FB_proto.close = function () {
            this.size = 0;
            delete this.data;
        };
        return FakeBlobBuilder;
    }(view));

    view.Blob = function (blobParts, options) {
        var type = options ? (options.type || "") : "";
        var builder = new BlobBuilder();
        if (blobParts) {
            for (var i = 0, len = blobParts.length; i < len; i++) {
                builder.append(blobParts[i]);
            }
        }
        return builder.getBlob(type);
    };
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));//Particle Editor
var PE = {};; (function () {
    var Util = {};

    Util.random = function (min,max) {
        return min + Math.floor(Math.random() * (max-min+1));
    }

    Util.downloadFile = function (code, fileName) {
        if (window.URL.createObjectURL) {
            var fileParts = [code];
            var bb = new Blob(fileParts, {
                type: "text/plain"
            });
            var dnlnk = window.URL.createObjectURL(bb);
            var dlLink = document.createElement("a");
            dlLink.setAttribute("href", dnlnk);
            dlLink.innerHTML = "aaaaaaaaaa"
            dlLink.setAttribute("download", fileName);
            document.body.appendChild(dlLink);
            dlLink.click();
            setTimeout(function () {
                document.body.removeChild(dlLink);
            }, 10)
        }
    }
    
    PE.Util = Util;
})();; (function () {
    var Vector2 = function (x, y) { this.x = x; this.y = y; };

    Vector2.prototype = {
        copy: function () {
            return new Vector2(this.x, this.y);
        },
        length: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        sqrLength: function () {
            return this.x * this.x + this.y * this.y;
        },
        normalize: function () {
            var inv = 1 / this.length();
            return new Vector2(this.x * inv, this.y * inv);
        },
        negate: function () {
            return new Vector2(-this.x, -this.y);
        },
        add: function (v) {
            this.x += v.x, this.y += v.y;
        },
        subtract: function (v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        },
        multiply: function (f) {
            return new Vector2(this.x * f, this.y * f);
        },
        divide: function (f) {
            var invf = 1 / f; return new Vector2(this.x * invf, this.y * invf);
        },
        dot: function (v) {
            return this.x * v.x + this.y * v.y;
        }
    };

    Vector2.zero = new Vector2(0, 0);

    PE.Vector2 = Vector2;
})();; (function () {
    var CircleAdjust = function (option) {
        this.min = option.min;
        this.max = option.max;
        this.rotation = option.rotation;
        this.value = option.value;
        this.change = option.change;
        this.renderTo = option.renderTo;

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas.height = 160;
        this.ctx = this.canvas.getContext("2d");
        this.angleRange = option.angleRange;
        this.renderTo.appendChild(this.canvas);
        if (this.angleRange) {
            this.setRange(this.angleRange)
        } else {
            this.render()
        };

        this.offset = this.canvas.getBoundingClientRect();
        var self=this;
        this.canvas.addEventListener("click", function (evt) {
            var x = evt.pageX - self.offset.left;
            var y = evt.pageY - self.offset.top;
            var sqrDist = Math.pow(Math.pow((x - 80), 2) + Math.pow((y - 80), 2), 0.5);
            var ag = 180 * Math.atan((y - 80) / (x - 80)) / Math.PI;

            if (ag >= 0 && x - 80 >= 0&&y-80>=0) {
                self.rotation = ag ;
            } else if (ag >= 0 && x - 80 < 0 && y - 80<0) {
                self.rotation = 180 + ag;
            } else if (ag < 0 && x - 80 <= 0 && y - 80 >= 0) {
                self.rotation =90+90 + ag;
            } else if (ag < 0 && x - 80 > 0 && y - 80 < 0) {
                self.rotation =360+ ag ;
            }
            self.value = self.min + (self.max - self.min) * sqrDist / 80;
            self.change(self.value, self.rotation);
            if (self.angleRange) {
                self.setRange(self.angleRange)
            } else {
                self.render()
            };
        }, false);
    };

    CircleAdjust.prototype = {
        setRange: function (angle) {
            this.angleRange = angle;
            this.render();
            this.ctx.beginPath()
            this.ctx.lineWidth = 1;
            this.ctx.arc(80, 80, this.r, (this.rotation - (angle / 2)) * Math.PI / 180, (this.rotation + (angle / 2) )* Math.PI / 180, false);
            this.ctx.stroke();
        },
        render: function () {

            this.ctx.clearRect(0, 0, 500, 500)
           
            this.ctx.beginPath()
            this.ctx.lineWidth = 1;
            this.ctx.arc(80, 80, 80, 0, 2 * Math.PI, false)
            this.ctx.stroke();
            this.ctx.beginPath()
            this.ctx.lineWidth = 4;
            this.ctx.moveTo(80, 80);
            this.x=80 + (80 * (this.value - this.min) / (this.max - this.min)) * Math.cos(this.rotation * Math.PI / 180);
            this.y = 80 + (80 * (this.value - this.min) / (this.max - this.min)) * Math.sin(this.rotation * Math.PI / 180);
            this.r = Math.pow(Math.pow((this.x - 80), 2) + Math.pow((this.y - 80), 2), 0.5);
            this.ctx.lineTo(this.x, this.y);
            
            this.ctx.stroke();
        }

    }


    PE.CircleAdjust = CircleAdjust;
})();; (function () {
    var RectAdjust = function (option) {
        this.min = option.min;
        this.max = option.max;
        this.value = option.value;
        this.change = option.change;
        this.renderTo = option.renderTo;
        this.fillStyle = option.fillStyle;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 140;
        this.canvas.height = 16;
        this.canvas.style.cssText = "border:1px solid black;";
        this.ctx = this.canvas.getContext("2d");

        this.renderTo.appendChild(this.canvas);
        this.render(160* ( this.value  - this.min) /(this.max-this.min));

        this.offset = this.canvas.getBoundingClientRect();
        var self = this;

        var isMouseDown = false;
        this.canvas.addEventListener("mousedown", function (evt) {
            isMouseDown = true;
            var x = evt.pageX - self.offset.left;
            var y = evt.pageY - self.offset.top;

            self.value = self.min + (self.max - self.min) * x / 140;
            if (self.value > self.max) self.value = self.max;
            if (self.value < self.min) self.value = self.min;
            self.change(self.value);
            self.render(x);

            evt.preventDefault();
            evt.stopPropagation();
        }, false)
        this.canvas.addEventListener("mousemove", function (evt) {
            if(isMouseDown){
                var x = evt.pageX - self.offset.left;
                var y = evt.pageY - self.offset.top;

                self.value = self.min + (self.max - self.min) * x / 140;
                if (self.value > self.max) self.value = self.max;
                if (self.value < self.min) self.value = self.min;
                self.change(self.value);
                self.render(x);

                evt.preventDefault();
                evt.stopPropagation();
            } 
        },false)
        document.addEventListener("mouseup", function (evt) {
            isMouseDown = false;
        }, false)
       
    };

    RectAdjust.prototype = {
        setRange: function () {

        },
        render: function (x) {
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.clearRect(0, 0, 500, 500)
            this.ctx.beginPath();

            this.ctx.fillRect(0,0,x,60)
        }

    }


    PE.RectAdjust = RectAdjust;
})();;(function(){
    var img = new Image();
    var textures = ["data:image/png;base64\,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJkSURBVHjaxJeJbusgEEW94S1L//83X18M2MSuLd2pbqc4wZGqRLrKBsyZhQHny7Jk73xVL8xpVhWrcmiB5lX+6GJ5YgQ2owbAm8oIwH1VgKZUmGcRqKGGPgtEQQAzGR8hQ59fAmhJHSAagigJ4E7GPWRXOYC6owAd1JM6wDQPADyMWUqZRMqmAojHp1Vn6EQQEgUNMJLnUjMyJsM49wygBkAPw9dVFwXRkncCIIW3GRgoTQUZn6HxCMAFEFd8TwEQ78X4rHbILoAUmeT+RFG4UhQ6MiIAE4W/UsYFjuVjAIa2nIY4q1R0GFtQWG3E84lqw2GO2QOoCKBVu0BAPgDSU0eUDjjQenNkV/AW/pWChhpMTelo1a64AOKM30vk18GzTHXCNtI/Knz3DFBgsUqBGIjTInXRY1yA9xkVoqW5tVq3pDR9A0hfF5BSARmVnh7RMDCaIdcNgbPBkgzn1Bu+SfIEFSpSBmkxyrMicb0fAEuCZrWnN89veA/4XcakrPcjBWzkTuLjlbfTQPOlBhz+HwkqqPXmPQDdrQItxE1moGof1S74j/8txk8EHhTQrAE8qlwfqS5yukm1x/rAJ9Jiaa6nyATqD78aUVBhFo8b1V4DdTXdCW+IxA1zB4JhiOhZMEWO1HqnvdoHZ4FAMIhV9REF8FiUm0jsYPEJx/Fm/N8OhH90HI9YRHesWbXXZwAShU8qThe7H8YAuJmw5yOd989uRINKRTJAhoF8jbqrHKfeCYdIISZfSq26bk/K+yO3YvfKrVgiwQBHnwt8ynPB25+M8hceTt/ybPhnryJ78+tLgAEAuCFyiQgQB30AAAAASUVORK5CYII=", "data:image/png;base64,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", "data:image/png;base64\,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", "data:image/png;base64\,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kDGxQUItm80BQAAAO6SURBVFjD7Zc/aJx1GMc/3/eSy/+aGChmsEOgFjtUWhxEqG5dBLu4KKJdFAU7uCmODqkitIMgFBEFRy2KgtRBUEEqDi1SEPHP4lCopk2b5HKXu7xfl+eVJ28vyaVQunjwwMH9fr/n8/x/Du7yR7u9YHsEKOKuAIeUkjp3BCCUDgNDIY0+ABtAL6Q7KEzRR9nJ9L1pexKYBKaAe0KmgZkk0+m3KWDS9qTt5nbvE9bUD3xfluVVSfuA0ZAxYCSkWfNCtn4d6ISsAW3bhaR2vH0VOLYtQFEUl2y/AfwNHAVawHhAjAbEVgAdoB3Kq5AVtvfavmz7ZFEUl3bywCjwKfAocBF4ogZReaEOsJ4sr3KmAdwH/CTpPUkfbZuEEbPxFPMzwDHbL0laid9Gk3UVQA/ohvUtYBVYAaZsn5P0OXACaEla3w6gSrg9KanetP2IpA+BXwYEWAEO2X4V+EbSy8BNYCUMuRUgSi0rn67E9mlgOiz5M7m4Augm968CB2w/ByxKegpYAm4kiE4/gFxqMzXZY/s1YErSt8CVyIMCKCP+lfJ9tp8EliS9AlxPcgNYzl4oagnZDOuq0hsPmYgEatl+HDgIzCa5N0AfCuXLkhb6VE+znvhFcv9QDWKk1gcmJH0NdGwfAuZryh+wfRRYlfR+ulvvH0Ohb1MZFlEyQzWQ4ZCRyiOSfrZ92Pb94ebleHQOaEv6IuXIcFac+kdRD0HV1yuQRg1oOIdH0pUYPtO29wJz0f9/TOBZYSMpVs69OsB2UmRPSVoDkDRie0PSb+nMIO9tAvAAUoZUbVeRP0hqRAVVZwZ5ry9ApWCjPl5Tq21HzMfD8r9s9yInZuJcN93N75VbAZQ1hb30UG4yLWAiEq4r6ddIxIupOubifDeB92pA5SaA6Ey9PiO1nabbKjBr+2Bk+w/AInANuC7pq9Qn5tPd6q3/QHInzI2oV3NzZXErdbiqzj8L5Ys1iA+AZdvHgQfj7loCqSD6bkTd2kjNU+1A6nBnQ+Ei8E8CWAJuSjoFLNk+ARxJEJ0U1l1Nw8O2345YLww6DW2/I2kWeB64sOM03GIfmAe+BC4Dp25jH3jL9hFJDwN/7LgPpI1oHNhv+4Kk80n5oBtRhliwfVzSfkm/D7SW2x6z3ZJ0Dnj9NnfCVpJ3bT9dFMUt+oa2WNevSXoB+CSUVu7d9VYcJfuM7fO21ySN7RSCs8DHkr6LnGgmxXmyFQmgrPWRCmQ9x9z2Y8Czkl7cEqAsy0ZRFBt36p9R/f27/t/w/8+/HM49ndEUx/gAAAAASUVORK5CYII=", "data:image/png;base64\,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", "data:image/png;base64\,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA1CAYAAAAZBliHAAAD/0lEQVRogdWaS6hVVRjHv3W7PnroFdGSrIxeig40C7RMbNCD68SBRhQR9CAHNVAIGyhGEFEkOihICQoUpchBETmwwF5CZhlqlKGg9jRFEjPT1PtrsM+G/z56PPes/e217/0Pz17f///7Dvuss/daK1gJAbeb2ZwyHiX0RgjhZGxxd2whMMTM1pvZLbEeJdVjZsuTpwLPUq/+BSbE8ofIpq80s71mNrLx0UYzOxgL0aF6zWxynhtCeCBRrhnwpnzzPwDRP5mI7DuAPslPM8cAtwLnJPj+JMFFhnWS/x3QlSL0cwn9sPLACzOMB04Ix1NVBz4oYf8Bdc3oBiwTlsNAT1VBlwIHJezVSoL6zzMcOCA8K6sKWi4hfwIj21dVK2BB0x040TvgGuAfCXnSNaCEgM+E6yNv8w1iviPJLNpPAdMo/sv0ehnfSVGzXYwdBawRvh/JHqdLGQZgu5i+68TqKmAscEw4F5c1fEzMTgLXObG6C1gsrH8BY2KNRgB/iNkLzqyuAoYAPwnv6lijl8XkF+AyZ1Z3AXOF+SwwtVODG4FTYvJwRazuAjYJ95ZOi9+X4q0VMVYiYBLZw0yu+f0tvEeK+siWlwaVgFXSw35geLuCS4DdUvRWIlZXAaOAI9LH0nYFT8vg48C4RKzuAhZKLyeAq1sNHA0clcHPJWZ1VePu3Sn9rG018DUZtA8YlpjVXcDdTfPVjOYBk4EzMmheTazuAjZKX18BQS9ulouf1MjpLuB6sqXoXI/mF+6jqGk1s7oLWCH9/QZ0d5nZLjP7W8bdVRNfJWrc2rPko20hhLP5xSXyjRwFRtdCWYGAR6S3U8ANenFoYybP9XqNrG4CLgd+lb5eutCgeTLgDDClBlZXAS9KT78DV7Qa+LEM3JyY01UtZ/MWg6eQvcfmGrT/58B70sfX6P93iwJ9gtsLDE3E6iZgjvTQB8zsT1HzM/uSBKxuArrINhJzreuk+BkpPA5cVSGrqzj/rWx8J8XdwPdiMCjey4Eesg3EXMtiTO5t+p3cVgGrq4CVwnyAdisvFzH6QIy+dOZ0FTCR4lrbgjJmNwGnxewhR1ZXUVxd/dTD8BUx/JkBuL4O9ArjOTzeMMl2VA6J8YDaUSHbQdkjfGs8zR8X4wG1h0Zxz+wYMNbTvAv4RgLecTMvIWAM2QZhrnK7pC1CZlFU7QsWwGrh2UPZffGLBOnJiG+p8WQEMJXiSYi5VYZdS/EszBOVhbVn2SIcm1IEPi+Bh6jh9BPnn3aalCK01vNuZOfb9kv+qpThesLxNHBzwuylkn0EGJUqOwf4gvq1MJY/6rx6o/HpZrbdzOqa2Xea2fQQQl9McTR0CGGHmb0dW++gRbFNm5n9D+f7ib7qlt8tAAAAAElFTkSuQmCC", "data:image/png;base64\,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"];
    img.src = textures[0];


    var ps;
    var dirCtrl = new PE.CircleAdjust({
        min: 0,
        max: 50,
        rotation: -30,
        value: 10,
        angleRange: 50,
        change: function (value, angle) {
            ps.angle=angle;
            ps.speed=value;
        },
        renderTo: document.getElementById("emitAngleCtrl")

    });


    var rangeCtrl = new PE.RectAdjust({
        min: 0,
        max: 360,
        value: 50,
        fillStyle: "black",
        change: function (value) {
            ps.angleRange=value;
            dirCtrl.setRange(value);
        },
        renderTo: document.getElementById("rangeCtrl")
    });


    var redCtrl = new PE.RectAdjust({
        min: 0,
        max: 1,
        value: 0.8,
        fillStyle: "red",
        change: function (value) {

            ps.filter=[redCtrl.value, greenCtrl.value, blueCtrl.value, alphaCtrl.value];
        },
        renderTo: document.getElementById("rCtrl")
    });

    var greenCtrl = new PE.RectAdjust({
        min: 0,
        max: 1,
        value: 0.2,
        fillStyle: "green",
        change: function (value) {
            ps.filter = [redCtrl.value, greenCtrl.value, blueCtrl.value, alphaCtrl.value];
        },
        renderTo: document.getElementById("gCtrl")
    });

    var blueCtrl = new PE.RectAdjust({
        min: 0,
        max: 1,
        value: 0.8,
        fillStyle: "blue",
        change: function (value) {
            ps.filter = [redCtrl.value, greenCtrl.value, blueCtrl.value, alphaCtrl.value];
        },
        renderTo: document.getElementById("bCtrl")
    });

    var alphaCtrl = new PE.RectAdjust({
        min: 0,
        max: 1,
        value: 1,
        fillStyle: "black",
        change: function (value) {
            ps.filter = [redCtrl.value, greenCtrl.value, blueCtrl.value, alphaCtrl.value];
        },
        renderTo: document.getElementById("aCtrl")
    });


    var widthCtrl = new PE.RectAdjust({
        min: 0,
        max: 100,
        value: 1,
        fillStyle: "black",
        change: function (value) {
            ps.emitArea[0]=value;
        },
        renderTo: document.getElementById("widthCtrl")
    });

    var heightCtrl = new PE.RectAdjust({
        min: 0,
        max: 100,
        value: 1,
        fillStyle: "black",
        change: function (value) {
            ps.emitArea[1] = value;
        },
        renderTo: document.getElementById("heightCtrl")
    });

    new PE.CircleAdjust({
        min: 0,
        max: 1,
        rotation: 90,
        value: 0.1,
        change: function (value, angle) {
            ps.gravity=new PE.Vector2(value * Math.cos(angle * Math.PI / 180), value * Math.sin(angle * Math.PI / 180));

        },
        renderTo: document.getElementById("gravityCtrl")

    });

    var scaleCtrl = new PE.RectAdjust({
        min: 0,
        max: 3,
        value: 1,
        fillStyle: "black",
        change: function (value) {
            ps.scaleX = ps.scaleY = value;
        },
        renderTo: document.getElementById("scaleCtrl")
    });

    var emitFQ = new PE.RectAdjust({
        min: 1,
        max: 15,
        value: 1,
        fillStyle: "black",
        change: function (value) {
            ps.emitCount = Math.floor(value);
        },
        renderTo: document.getElementById("emitFQ")
    });


    img.onload = function () {
        var stage = new AlloyPaper.Stage("#ourCanvas");
 
        ps = new AlloyPaper.ParticleSystem({
            emitX: 200,
            emitY: 200,
            speed: 10,
            angle: -30,
            angleRange: 50,
            emitArea: [1, 1],
           
            texture: "data:image/png;base64\,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJkSURBVHjaxJeJbusgEEW94S1L//83X18M2MSuLd2pbqc4wZGqRLrKBsyZhQHny7Jk73xVL8xpVhWrcmiB5lX+6GJ5YgQ2owbAm8oIwH1VgKZUmGcRqKGGPgtEQQAzGR8hQ59fAmhJHSAagigJ4E7GPWRXOYC6owAd1JM6wDQPADyMWUqZRMqmAojHp1Vn6EQQEgUNMJLnUjMyJsM49wygBkAPw9dVFwXRkncCIIW3GRgoTQUZn6HxCMAFEFd8TwEQ78X4rHbILoAUmeT+RFG4UhQ6MiIAE4W/UsYFjuVjAIa2nIY4q1R0GFtQWG3E84lqw2GO2QOoCKBVu0BAPgDSU0eUDjjQenNkV/AW/pWChhpMTelo1a64AOKM30vk18GzTHXCNtI/Knz3DFBgsUqBGIjTInXRY1yA9xkVoqW5tVq3pDR9A0hfF5BSARmVnh7RMDCaIdcNgbPBkgzn1Bu+SfIEFSpSBmkxyrMicb0fAEuCZrWnN89veA/4XcakrPcjBWzkTuLjlbfTQPOlBhz+HwkqqPXmPQDdrQItxE1moGof1S74j/8txk8EHhTQrAE8qlwfqS5yukm1x/rAJ9Jiaa6nyATqD78aUVBhFo8b1V4DdTXdCW+IxA1zB4JhiOhZMEWO1HqnvdoHZ4FAMIhV9REF8FiUm0jsYPEJx/Fm/N8OhH90HI9YRHesWbXXZwAShU8qThe7H8YAuJmw5yOd989uRINKRTJAhoF8jbqrHKfeCYdIISZfSq26bk/K+yO3YvfKrVgiwQBHnwt8ynPB25+M8hceTt/ybPhnryJ78+tLgAEAuCFyiQgQB30AAAAASUVORK5CYII=",
            filter: [0.8, 0.2, 0.8, 1],
            emitCount: 1,
            maxCount: 2000
        });

        
        // ps.container.scaleX = ps.container.scaleY = 1;
        stage.add(ps);
        stage.on("mousemove", function (evt) {
            ps.emitX = evt.stageX;
            ps.emitY = evt.stageY;
        })
    
   

        var ttSlt = document.getElementById("ttSlt");
        ttSlt.onchange = function () {

            var index = ttSlt.selectedIndex; // 选中索引
            var value = ttSlt.options[index].value; // 选中值
            
            img.onload = function () {
                ps.texture = img;
            }
            img.src = textures[value];
         
        }

        img.onload = null;


        

        var viewBtn = document.getElementById("viewOption"), dBtn = document.getElementById("downloadOption"), optTextarea = document.getElementById("optTextarea"), closeBtn = document.getElementById("closeBtn"), popup = document.getElementById("popup");
        viewBtn.onclick = function (evt) {
            var jsonStr = "{\n";
            jsonStr += " speed:" + ps.speed + ",\n";
            jsonStr += " angle:" + ps.angle + ",\n";
            jsonStr += " angleRange:" + ps.angleRange + ",\n";
            jsonStr += " emitArea:[" + ps.emitArea + "],\n";
            jsonStr += " gravity:[" + ps.gravity.x + "," + ps.gravity.y + "],\n";
            jsonStr += " filter:[" + ps.filter + "],\n";
            jsonStr += " emitCount:" + ps.emitCount + ",\n";
            jsonStr += " texture:\"" + ps.texture.src + "\"\n";
            jsonStr += "}";
            popup.style.display = "block";
            optTextarea.value = jsonStr;
            evt.stopPropagation();
        }

        dBtn.onclick = function () {
 
            var jsonStr = "{\n";
            jsonStr += " speed:" + ps.speed + ",\n";
            jsonStr += " angle:" + ps.angle + ",\n";
            jsonStr += " angleRange:" + ps.angleRange + ",\n";
            jsonStr += " emitArea:[" + ps.emitArea + "],\n";
            jsonStr += " gravity:[" + ps.gravity.x + "," + ps.gravity.y + "],\n";
            jsonStr += " filter:[" + ps.filter + "],\n";
            jsonStr += " emitCount:" + ps.emitCount + ",\n";
            jsonStr += " texture:\"" + ps.texture.src + "\"\n";       
            jsonStr += "}";
            PE.Util.downloadFile(jsonStr, "particles" + Date.now() + ".json");
        }

        closeBtn.onclick = function () {
            popup.style.display = "none";
        }

        var dom = {};
        dom.byId = function (id) {
            return document.getElementById(id);
        }
        var target = dom.byId("drop-target");

        var render = function (src) {
        
            var newImg = new Image();
            newImg.onload = function () {
                ps.texture = newImg;
            };
            textures.push(src);
            newImg.src = src;
        };

        var readImage = function (imgFile) {
            if (!imgFile.type.match(/image.*/)) {
                console.log("The dropped file is not an image: ", imgFile.type);
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                render(e.target.result);
            };
            reader.readAsDataURL(imgFile);
        };

        //	DOMReady setup
        target.addEventListener("dragover", function (e) { e.preventDefault(); }, true);
        target.addEventListener("drop", function (e) {
            e.preventDefault();
            readImage(e.dataTransfer.files[0]);
        }, true);


   
    }



})();
