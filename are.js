/* Alloy Game Engine
 * By AlloyTeam http://www.alloyteam.com/
 * Github: https://github.com/AlloyTeam/AlloyGameEngine
 * MIT Licensed.
 */
; (function () {
    var initializing = false, fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function () { };

    // Create a new Class that inherits from this class
    Class.extend = function (prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            if (name != "statics") {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] == "function" &&
                  typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                  (function (name, fn) {
                      return function () {
                          var tmp = this._super;

                          // Add a new ._super() method that is the same method
                          // but on the super-class
                          this._super = _super[name];

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
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.ctor)
                this.ctor.apply(this, arguments);
        }

        //继承父类的静态属性
        for (var key in this) {
            if (this.hasOwnProperty(key) && key != "extend")
                Class[key] = this[key];
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        //静态属性和方法
        if (prop.statics) {
            for (var name in prop.statics) {
                if (prop.statics.hasOwnProperty(name)) {
                    Class[name] = prop.statics[name];
                    if (name == "ctor") {
                        //提前执行静态构造函数
                        Class[name]();
                    }
                }

            }
        }

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        //add implementation method
        Class.implement = function (prop) {
            for (var name in prop) {
                prototype[name] = prop[name];
            }
        };
        return Class;
    };
})();


; (function (win) {
    var ARE = {};
    //begin-------------------ARE.FPS---------------------begin

    ARE.FPS = Class.extend({
        "statics": {
            "get": function () {
                if (!this.instance) this.instance = new this();
                this.instance._computeFPS();
                return this.instance;
            }
        },
        "ctor": function () {
            this.last = new Date();
            this.current = null;
            this.value = 0;
            this.totalValue = 0;
            this.fpsList = [];
            this.count = 0;
            var self = this;
            setInterval(function () {
                var lastIndex = self.fpsList.length - 1;
                self.value = self.fpsList[lastIndex];
                if (lastIndex > 500) {
                    self.fpsList.shift();
                }
                self.averageFPS = Math.ceil(self.totalValue / self.count);
            }, 500);
        },
        "_computeFPS": function () {
            this.current = new Date();
            if (this.current - this.last > 0) {
                var fps = Math.ceil(1e3 / (this.current - this.last));
                this.fpsList.push(fps);
                this.count++;
                this.totalValue += fps;
                this.last = this.current;
            }
        }
    });

    //end-------------------ARE.FPS---------------------end

    //begin-------------------ARE.DisplayObject---------------------begin

    ARE.DisplayObject = Class.extend({
        "ctor": function () {
            this.alpha = this.scaleX = this.scaleY = this.scale = 1;
            this.x = this.y = this.rotation = this.originX = this.originY = this.skewX = this.skewY = this.width = this.height = this.regX = this.regY = 0;
            this.textureReady = true;
            this.visible = true;
            this._matrix = new ARE.Matrix2D();
            this._hitMatrix = new ARE.Matrix2D();
            this.events = {};
            this.id = ARE.UID.get();
            this.cacheID = 0;
            this.baseInstanceof = "DisplayObject";
            var self = this;
            this._watch(this, "originX", function (prop, value) {
                if (typeof value === "string") {
                    self.regX = parseInt(value);
                } else {
                    self.regX = self.width * value;
                }
            });
            this._watch(this, "originY", function (prop, value) {
                if (typeof value === "string") {
                    self.regY = parseInt(value);
                } else {
                    self.regY = self.height * value;
                }
            });
            this._watch(this, "filter", function (prop, value) {
                self.setFilter.apply(self, value);
            });
            this._watch(this, "scale", function (prop, value) {
                this.scaleX = this.scaleY = this.scale;
            });
            this._preAABB = [-1, -1, 0, 0];
            this.cursor = "default";
            this.onMouseOver(function () { });
        },
        "_watch": function (target, prop, onPropertyChanged) {
            var self = this;
            if (typeof prop === "string") {
                var currentValue = target["__" + prop] = this[prop];
                Object.defineProperty(target, prop, {
                    get: function () {
                        return this["__" + prop];
                    },
                    set: function (value) {
                        this["__" + prop] = value;
                        onPropertyChanged.apply(target, [prop, value]);
                    }
                });
            } else {
                for (var i = 0, len = prop.length; i < len; i++) {
                    var propName = prop[i];
                    var currentValue = target["__" + propName] = this[propName];
                    (function (propName) {
                        Object.defineProperty(target, propName, {
                            get: function () {
                                return this["__" + propName];
                            },
                            set: function (value) {
                                this["__" + propName] = value;
                                onPropertyChanged.apply(target, [propName, value]);
                            }
                        });
                    })(propName);
                }
            }
        },
        "isVisible": function () {
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.textureReady);
        },
        "on": function (type, fn) {
            this.events[type] || (this.events[type] = []);
            this.events[type].push(fn);
        },
        "execEvent": function (type, event) {
            var fns = this.events[type],
                result = true;
            if (fns) {
                for (var i = 0, len = fns.length; i < len; i++) {
                    result = fns[i].call(this, event);
                }
            }
            if (type === "mouseover" && this.cursor !== "default") {
                this._setCursor(this, this.cursor);
            } else if (type === "mouseout") {
                this._setCursor(this, "default");
            }
            return result;
        },
        "_setCursor": function (obj, type) {
            if (obj.parent instanceof ARE.Stage) {
                obj.parent.setCursor(type);
            } else {
                this._setCursor(obj.parent, type);
            }
        },
        "clone": function () {
            var o = new ARE.DisplayObject();
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
            this.cacheID = ARE.UID.getCacheID();
            this.updateCache(this.cacheCtx, this, bound.width, bound.width);
        },
        "uncache": function () {
            this.cacheCanvas = null;
            this.cacheCtx = null;
            this.cacheID = null;
        },
        "setFilter": function (r, g, b, a) {
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
        "destroy": function () {
            this.cacheCanvas = null;
            this.cacheCtx = null;
            this.cacheID = null;
            this._matrix = null;
            this.events = null;
            if (this.parent) {
                this.parent.remove(this);
            }
        },
        "initAABB": function () {
            var x = 0,
                y = 0,
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
                y: ty
            }, {
                x: x_a + tx,
                y: x_b + ty
            }, {
                x: x_a + y_c + tx,
                y: x_b + y_d + ty
            }, {
                x: y_c + tx,
                y: y_d + ty
            }];
        },
        "updateCache": function (ctx, o, w, h) {
            ctx.clearRect(0, 0, w + 1, h + 1);
            this.renderCache(ctx, o);
        },
        "renderCache": function (ctx, o) {
            if (!o.isVisible()) {
                return;
            }
            if (o instanceof ARE.Container || o instanceof ARE.Stage) {
                var list = o.children.slice(0);
                for (var i = 0, l = list.length; i < l; i++) {
                    ctx.save();
                    this.render(ctx, list[i]);
                    ctx.restore();
                }
            } else if (o instanceof ARE.Bitmap || o instanceof ARE.Sprite) {
                var rect = o.rect;
                ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
            } else if (o.txtCanvas) {
                ctx.drawImage(o.txtCanvas, 0, 0);
            } else if (o.shapeCanvas) {
                ctx.drawImage(o.shapeCanvas, 0, 0);
            }
        },
        "onClick": function (fn) {
            this.on("click", fn);
        },
        "onMouseDown": function (fn) {
            this.on("pressdown", fn);
        },
        "onMouseMove": function (fn) {
            this.on("mousemove", fn);
        },
        "onMouseUp": function (fn) {
            this.on("pressup", fn);
        },
        "onMouseOver": function (fn) {
            this.on("mouseover", fn);
        },
        "onMouseOut": function (fn) {
            this.on("mouseout", fn);
        },
        "onHover": function (over, out) {
            this.on("mouseover", over);
            this.on("mouseout", out);
        },
        "onPressDown": function (fn) {
            this.on("pressdown", fn);
        },
        "onPressMove": function (fn) {
            this.on("pressmove", fn);
        },
        "onPressUp": function (fn) {
            this.on("pressup", fn);
        },
        "onMouseWheel": function (fn) {
            this.on("mousewheel", fn);
        },
        "onTouchStart": function (fn) {
            this.on("pressdown", fn);
        },
        "onTouchMove": function (fn) {
            this.on("pressmove", fn);
        },
        "onTouchEnd": function (fn) {
            this.on("pressup", fn);
        },
        "onDbClick": function (fn) {
            this.on("dblclick", fn);
        }
    });

    //end-------------------ARE.DisplayObject---------------------end

    //begin-------------------ARE.CircleShape---------------------begin

    ARE.CircleShape = ARE.DisplayObject.extend({
        "ctor": function (r, color, isHollow) {
            this._super();
            this.r = r || 1;
            this.color = color || "black";
            this.isHollow = isHollow;
            this.width = this.height = 2 * r;
            this.shapeCanvas = document.createElement("canvas");
            this.shapeCanvas.width = this.width;
            this.shapeCanvas.height = this.height;
            this.shapeCtx = this.shapeCanvas.getContext("2d");
            this.draw();
            this.cacheID = ARE.UID.getCacheID();
        },
        "draw": function (ctx) {
            var ctx = this.shapeCtx;
            ctx.beginPath();
            ctx.arc(this.r, this.r, this.r, 0, Math.PI * 2);
            this.originX = this.originY = .5;
            this.isHollow ? (ctx.strokeStyle = this.color, ctx.stroke()) : (ctx.fillStyle = this.color, ctx.fill());
        }
    });

    //end-------------------ARE.CircleShape---------------------end

    //begin-------------------ARE.DomElement---------------------begin

    ARE.DomElement = ARE.DisplayObject.extend({
        "ctor": function (selector) {
            this._super();
            this.element = typeof selector == "string" ? document.querySelector(selector) : selector;
            var element = this.element;
            var observer = ARE.Observable.watch(this, ["x", "y", "scaleX", "scaleY", "perspective", "rotation", "skewX", "skewY", "regX", "regY"]);
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
                        this.element.style.visibility = "visible";
                    } else {
                        this.element.style.visibility = "hidden";
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
            this.element.style.visibility = "hidden";
            this.element.style.position = "absolute";
        },
        "isVisible": function () {
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
        }
    });

    //end-------------------ARE.DomElement---------------------end

    //begin-------------------ARE.Bitmap---------------------begin

    ARE.Bitmap = ARE.DisplayObject.extend({
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
            var cacheImg = ARE.Bitmap[img];
            if (cacheImg) {
                this._init(cacheImg);
            } else {
                var self = this;
                this.textureReady = false;
                this.img = document.createElement("img");
                this.img.onload = function () {
                    if (!self.rect) self.rect = [0, 0, self.img.width, self.img.height];
                    self.width = self.rect[2];
                    self.height = self.rect[3];
                    self.regX = self.width * self.originX;
                    self.regY = self.height * self.originY;
                    ARE.Bitmap[img] = self.img;
                    self.textureReady = true;
                    self.imageLoadHandle && self.imageLoadHandle();
                    if (self.filter) self.filter = self.filter;
                };
                this.img.src = img;
            }
        },
        "_init": function (img) {
            if (!img) return;
            this.img = img;
            this.width = img.width;
            this.height = img.height;
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
            var o = new ARE.Bitmap(this.img);
            o.rect = this.rect.slice(0);
            this.cloneProps(o);
            return o;
        },
        "flipX": function () { },
        "flipY": function () { }
    });

    //end-------------------ARE.Bitmap---------------------end

    //begin-------------------ARE.Particle---------------------begin

    ARE.Particle = ARE.Bitmap.extend({
        "ctor": function (option) {
            this._super(option.texture);
            this.originX = .5;
            this.originY = .5;
            this.position = option.position;
            this.x = this.position.x;
            this.y = this.position.y;
            this.rotation = option.rotation || 0;
            this.velocity = option.velocity;
            this.acceleration = option.acceleration || new ARE.Vector2(0, 0);
            this.rotatingSpeed = option.rotatingSpeed || 0;
            this.rotatingAcceleration = option.rotatingAcceleration || 0;
            this.hideSpeed = option.hideSpeed || .01;
            this.zoomSpeed = option.hideSpeed || .01;
            this.isAlive = true;
            this.img = option.texture;
            this.img.src = "";
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

    //end-------------------ARE.Particle---------------------end

    //begin-------------------ARE.Container---------------------begin

    ARE.Container = ARE.DisplayObject.extend({
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
                        if (item instanceof ARE.DomElement) {
                            ARE.Stage.domSurface.appendChild(item.element);
                            item.element.style.visibility = "visible";
                            var style = window.getComputedStyle(item.element, null);
                            item.width = parseInt(style.width);
                            item.height = parseInt(style.height);
                        }
                    }
                }
            } else {
                if (obj) {
                    this.children.push(obj);
                    obj.parent = this;
                    if (obj instanceof ARE.DomElement) {
                        ARE.Stage.domSurface.appendChild(obj.element);
                        obj.element.style.visibility = "visible";
                        var style = window.getComputedStyle(obj.element, null);
                        obj.width = parseInt(style.width);
                        obj.height = parseInt(style.height);
                    }
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
                            if (currentObj instanceof ARE.DomElement) {
                                ARE.Stage.domSurface.removeChild(currentObj.element);
                            }
                            break;
                        }
                    }
                }
            } else {
                for (var i = childLen; --i >= 0;) {
                    if (this.children[i].id == obj.id) {
                        obj.parent = null;
                        this.children.splice(i, 1);
                        if (obj instanceof ARE.DomElement) {
                            ARE.Stage.domSurface.removeChild(obj.element);
                        }
                        break;
                    }
                }
            }
        },
        "clone": function () {
            var o = new ARE.Container();
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
        },
        "destroy": function () {
            this._super();
            var kids = this.children;
            while (kids.length) {
                var kid = kids.pop();
                kid.destroy();
            }
        },
        "swapChildrenAt": function (index1, index2) {
            var kids = this.children;
            var o1 = kids[index1];
            var o2 = kids[index2];
            if (!o1 || !o2) {
                return;
            }
            kids[index1] = o2;
            kids[index2] = o1;
        },
        "swapChildren": function (child1, child2) {
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
        "swapToTop": function (child) {
            this.swapChildren(child, this.children[this.children.length - 1]);
        }
    });

    //end-------------------ARE.Container---------------------end

    //begin-------------------ARE.ParticleSystem---------------------begin

    ARE.ParticleSystem = ARE.Container.extend({
        "ctor": function (option) {
            this._super();
            this.speed = option.speed;
            this.angle = option.angle;
            this.angleRange = option.angleRange;
            this.emitArea = option.emitArea;
            this.gravity = option.gravity || {
                x: 0,
                y: 0
            };
            this.filter = option.filter;
            this.compositeOperation = "lighter";
            this.emitCount = option.emitCount;
            this.maxCount = option.maxCount || 1e3;
            this.emitX = option.emitX;
            this.emitY = option.emitY;
            var self = this;
            if (typeof option.texture === "string") {
                if (ARE.Bitmap[option.texture]) {
                    this.texture = ARE.Bitmap[option.texture];
                    this.generateFilterTexture(this.texture);
                } else {
                    this.bitmap = new ARE.Bitmap();
                    this.bitmap._parent = this;
                    this.bitmap.onImageLoad(function () {
                        this._parent.texture = this.img;
                        this._parent.generateFilterTexture(this.img);
                        delete this._parent;
                    });
                    this.bitmap.useImage(option.texture);
                }
            } else {
                this.texture = option.texture;
                this.generateFilterTexture(option.texture);
            }
            this.totalCount = option.totalCount;
            this.emittedCount = 0;
            this.tickFPS = 60;
            this.hideSpeed = option.hideSpeed || .01;
        },
        "generateFilterTexture": function (texture) {
            var bitmap = new ARE.Bitmap(texture);
            bitmap.filter = this.filter;
            this.filterTexture = bitmap.cacheCanvas;
        },
        "emit": function () {
            var angle = (this.angle + ARE.Util.random(-this.angleRange / 2, this.angleRange / 2)) * Math.PI / 180;
            var halfX = this.emitArea[0] / 2,
                harfY = this.emitArea[1] / 2;
            var particle = new ARE.Particle({
                position: new ARE.Vector2(this.emitX + ARE.Util.random(-halfX, halfX), this.emitY + ARE.Util.random(-harfY, harfY)),
                velocity: new ARE.Vector2(this.speed * Math.cos(angle), this.speed * Math.sin(angle)),
                texture: this.filterTexture,
                acceleration: this.gravity,
                hideSpeed: this.hideSpeed
            });
            this.add(particle);
            this.emittedCount++;
        },
        "tick": function () {
            if (this.filterTexture) {
                var len = this.children.length;
                if (this.totalCount && this.emittedCount > this.totalCount) {
                    if (len === 0) this.destroy();
                } else {
                    if (len < this.maxCount) {
                        for (var k = 0; k < this.emitCount; k++) {
                            this.emit();
                        }
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

    //end-------------------ARE.ParticleSystem---------------------end

    //begin-------------------ARE.RectAdjust---------------------begin

    ARE.RectAdjust = Class.extend({
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

    //end-------------------ARE.RectAdjust---------------------end

    //begin-------------------ARE.RectShape---------------------begin

    ARE.RectShape = ARE.DisplayObject.extend({
        "ctor": function (width, height, color, isHollow) {
            this._super();
            this.color = color || "black";
            this.isHollow = isHollow;
            this.width = width;
            this.height = height;
            this.originX = this.originY = .5;
            this.shapeCanvas = document.createElement("canvas");
            this.shapeCanvas.width = this.width;
            this.shapeCanvas.height = this.height;
            this.shapeCtx = this.shapeCanvas.getContext("2d");
            this.draw();
            this.cacheID = ARE.UID.getCacheID();
        },
        "draw": function (ctx) {
            var ctx = this.shapeCtx;
            ctx.beginPath();
            ctx.arc(this.r, this.r, this.r, 0, Math.PI * 2);
            this.isHollow ? (ctx.strokeStyle = this.color, ctx.strokeRect(0, 0, this.width, this.height)) : (ctx.fillStyle = this.color, ctx.fillRect(0, 0, this.width, this.height));
        }
    });

    //end-------------------ARE.RectShape---------------------end

    //begin-------------------ARE.Sprite---------------------begin

    ARE.Sprite = ARE.DisplayObject.extend({
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
            this._loadedCount = 0;
            var self = this,
                len = this.option.imgs.length;
            for (var i = 0; i < len; i++) {
                var urlOrImg = this.option.imgs[i];
                if (typeof urlOrImg === "string") {
                    if (ARE.Bitmap[urlOrImg]) {
                        this.bitmaps.push(new ARE.Bitmap(ARE.Bitmap[urlOrImg]));
                        this._loadedCount++;
                    } else {
                        var bmp = new ARE.Bitmap();
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
                } else {
                    this._loadedCount++;
                    this.bitmaps.push(new ARE.Bitmap(urlOrImg));
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
        "gotoAndStop": function (animation) {
            this.reset();
            clearInterval(this.loop);
            var self = this;
            self.currentAnimation = animation;
            var opt = self.option;
            var frames = opt.animations[self.currentAnimation].frames,
                len = frames.length;
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

    //end-------------------ARE.Sprite---------------------end

    //begin-------------------ARE.Shape---------------------begin

    ARE.Shape = ARE.DisplayObject.extend({
        "ctor": function (width, height, debug) {
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
            this._watch(this, "scaleX", function (prop, value) {
                this.width = this._width * value;
                this.height = this._height * this.scaleY;
                this.originX = this.originX;
                this.shapeCanvas.width = this.width;
                this.shapeCanvas.height = this.height;
                this.shapeCtx.scale(value, this.scaleY);
                this.end();
            });
            this._watch(this, "scaleY", function (prop, value) {
                this.width = this._width * this.scaleX;
                this.height = this._height * value;
                this.originY = this.originY;
                this.shapeCanvas.width = this.width;
                this.shapeCanvas.height = this.height;
                this.shapeCtx.scale(this.scaleX, value);
                this.end();
            });
        },
        "end": function () {
            this._preCacheId = this.cacheID;
            this.cacheID = ARE.UID.getCacheID();
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
        "clearRect": function (x, y, width, height) {
            this.cacheID = ARE.UID.getCacheID();
            this.shapeCtx.clearRect(x, y, width, height);
        },
        "clear": function () {
            this.cacheID = ARE.UID.getCacheID();
            this.shapeCtx.clearRect(0, 0, this.width, this.height);
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

    //end-------------------ARE.Shape---------------------end

    //begin-------------------ARE.Stage---------------------begin

    ARE.Stage = ARE.Container.extend({
        "ctor": function (canvas, closegl) {
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
            this.pause = false;
            this.fps = 63;
            this.interval = Math.floor(1e3 / this.fps);
            var self = this;
            self.loop = setInterval(function () {
                if (self.pause) return;
                self._tick(self);
            }, self.interval);
            Object.defineProperty(this, "useRequestAnimFrame", {
                set: function (value) {
                    this._useRequestAnimFrame = value;
                    if (value) {
                        clearInterval(self.loop);
                        self.loop = ARE.RAF.requestInterval(function () {
                            self._tick(self);
                        }, self.interval);
                    } else {
                        ARE.RAF.clearRequestInterval(self.loop);
                        self.loop = setInterval(function () {
                            self._tick(self);
                        }, self.interval);
                    }
                },
                get: function () {
                    return this._useRequestAnimFrame;
                }
            });
            this._watch(this, "fps", function (prop, value) {
                this.interval = Math.floor(1e3 / value);
                var self = this;
                if (this.useRequestAnimFrame) {
                    clearInterval(this.loop);
                    try {
                        ARE.RAF.clearRequestInterval(this.loop);
                    } catch (e) { }
                    this.loop = ARE.RAF.requestInterval(function () {
                        self._tick(self);
                    }, this.interval);
                } else {
                    ARE.RAF.clearRequestInterval(this.loop);
                    try {
                        clearInterval(this.loop);
                    } catch (e) { }
                    this.loop = setInterval(function () {
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
                set: function (value) {
                    this._moveFPS = value;
                    this._moveInterval = 1e3 / value;
                },
                get: function () {
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
            window.addEventListener("resize", function () {
                self.offset = self._getXY(self.canvas);
                if (self.domSurface) {
                    self.domSurface.style.left = self.offset[0] + "px";
                    self.domSurface.style.top = self.offset[1] + "px";
                }
                if (self._scaleX) {
                    self.scaleToScreen(self._scaleX, self._scaleY);
                }
            }, false);
        },
        "openDom": function () {
            this._initDomSurface();
        },
        "closeDom": function () {
            document.body.removeChild(this.domSurface);
        },
        "openDebug": function () { },
        "closeDebug": function () { },
        "_initDebug": function () {
            this.debugDiv = document.createElement("div");
            this.debugDiv.style.cssText = "display:none;position:absolute;z-index:2000;left:0;top:0;background-color:yellow;font-size:16px;";
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
        "_handleMouseWheel": function (event) {
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
        "_initDomSurface": function () {
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
        "update": function () {
            this.stageRenderer.update();
        },
        "_correctionEvent": function (evt) {
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
        "_handleClick": function (evt) {
            this._correctionEvent(evt);
            this._getObjectUnderPoint(evt, evt.type);
        },
        "_handleMouseMove": function (evt) {
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
        "_getPressmoveTarget": function (o) {
            if (o.events["pressmove"]) {
                this._pressmoveObjs = o;
            }
            if (o.parent) this._getPressmoveTarget(o.parent);
        },
        "_handleMouseDown": function (evt) {
            this._correctionEvent(evt);
            var child = this._getObjectUnderPoint(evt, "pressdown");
            if (child) {
                this._getPressmoveTarget(child);
            }
        },
        "_handleMouseUp": function (evt) {
            this._pressmoveObjs = null;
            this._correctionEvent(evt);
            this._getObjectUnderPoint(evt, "pressup");
        },
        "_handleDblClick": function (evt) {
            this._correctionEvent(evt);
            this._getObjectUnderPoint(evt, evt.type);
        },
        "_getObjectUnderPoint": function (evt, type) {
            if (this.hitAABB) {
                return this.hitRenderer.hitAABB(this.hitCtx, this, evt, type);
            } else {
                return this.hitRenderer.hitRender(this.hitCtx, this, evt, type);
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
        "_tick": function (container) {
            if (container && container.tick) {
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
                this.getFPS();
                this.debugDiv.innerHTML = "fps : " + this.fpsValue + " <br/>average fps : " + this.averageFPS + " <br/>object count : " + this.getTotalCount() + " <br/>rendering mode : " + this.getRenderingMode() + " <br/>inner object count  : " + this.stageRenderer.objs.length;
            }
        },
        "onTick": function (fn) {
            this.tickFn = fn;
        },
        "setFPS": function (fps) {
            this.interval = Math.floor(1e3 / fps);
        },
        "onKeyboard": function (keyCombo, onDownCallback, onUpCallback) {
            ARE.Keyboard.on(keyCombo, onDownCallback, onUpCallback);
        },
        "getActiveKeys": function () {
            return ARE.Keyboard.getActiveKeys();
        },
        "scaleToScreen": function (scaleX, scaleY) {
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
        "correctingXY": function (x, y) {
            return {
                x: x * this.width / (window.innerWidth * this._scaleX),
                y: y * this.height / (window.innerHeight * this._scaleY)
            };
        },
        "getTotalCount": function () {
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
        "getRenderingMode": function () {
            if (this.stageRenderer.renderingEngine instanceof ARE.CanvasRenderer) {
                return "Canvas";
            }
            return "WebGL";
        },
        "getFPS": function () {
            var fps = ARE.FPS.get();
            this.fpsValue = fps.value;
            this.averageFPS = fps.averageFPS;
        },
        "addEvent": function (el, type, fn, capture) {
            if (type === "mousewheel" && document.mozHidden !== undefined) {
                type = "DOMMouseScroll";
            }
            el.addEventListener(type, function (event) {
                var type = event.type;
                if (type == "DOMMouseScroll" || type == "mousewheel") {
                    event.delta = event.wheelDelta ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
                }
                fn.call(this, event);
            }, capture || false);
        },
        "setCursor": function (type) {
            this.canvas.style.cursor = type;
            if (this.domSurface) this.domSurface.style.cursor = type;
        }
    });

    //end-------------------ARE.Stage---------------------end

    //begin-------------------ARE.Text---------------------begin

    ARE.Text = ARE.DisplayObject.extend({
        "ctor": function (value, font, color) {
            this._super();
            this.value = value;
            this.font = font;
            this.color = color;
            this.textAlign = "left";
            this.textBaseline = "top";
        },
        "draw": function (ctx) {
            ctx.fillStyle = this.color;
            ctx.font = this.font;
            ctx.textAlign = this.textAlign || "left";
            ctx.textBaseline = this.textBaseline || "top";
            ctx.fillText(this.value, 0, 0);
        },
        "clone": function () {
            var t = new ARE.Text(this.text, this.font, this.color);
            this.cloneProps(t);
            return t;
        }
    });

    //end-------------------ARE.Text---------------------end

    //begin-------------------ARE.CanvasRenderer---------------------begin

    ARE.CanvasRenderer = Class.extend({
        "ctor": function (canvas) {
            if (canvas) {
                this.canvas = canvas;
                this.ctx = this.canvas.getContext("2d");
                this.height = this.canvas.width;
                this.width = this.canvas.height;
            }
        },
        "hitAABB": function (ctx, o, evt, type) {
            var list = o.children.slice(0),
                l = list.length;
            for (var i = l - 1; i >= 0; i--) {
                var child = list[i];
                if (!this.isbindingEvent(child)) continue;
                var target = this._hitAABB(ctx, child, evt, type);
                if (target) return target;
            }
        },
        "_hitAABB": function (ctx, o, evt, type) {
            if (!o.isVisible()) {
                return;
            }
            if (o instanceof ARE.Container) {
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
        "hitRender": function (ctx, o, evt, type) {
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
        "_hitRender": function (ctx, o, mtx, evt, type) {
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
            if (o instanceof ARE.Shape) {
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
            } else if (o instanceof ARE.Container) {
                var list = o.children.slice(0),
                    l = list.length;
                for (var i = l - 1; i >= 0; i--) {
                    ctx.save();
                    var target = this._hitRender(ctx, list[i], mtx, evt, type);
                    if (target) return target;
                    ctx.restore();
                }
            } else if (o instanceof ARE.Bitmap || o instanceof ARE.Sprite) {
                ctx.globalAlpha = o.complexAlpha;
                ctx.globalCompositeOperation = o.complexCompositeOperation;
                var rect = o.rect;
                ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
            } else if (o instanceof ARE.Graphics) {
                ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                o.draw(ctx);
            }
            if (ctx.getImageData(0, 0, 1, 1).data[3] > 1 && !(o instanceof ARE.Container)) {
                this._bubbleEvent(o, type, evt);
                return o;
            }
        },
        "_bubbleEvent": function (o, type, event) {
            var result = o.execEvent(type, event);
            if (result !== false) {
                if (o.parent && o.parent.events[type] && o.parent.events[type].length > 0 && o.parent.baseInstanceof !== "Stage") {
                    this._bubbleEvent(o.parent, type, event);
                }
            }
        },
        "isbindingEvent": function (obj) {
            if (Object.keys(obj.events).length !== 0) return true;
            if (obj instanceof ARE.Container) {
                for (var i = 0, len = obj.children.length; i < len; i++) {
                    var child = obj.children[i];
                    if (child instanceof ARE.Container) {
                        return this.isbindingEvent(child);
                    } else {
                        if (Object.keys(child.events).length !== 0) return true;
                    }
                }
            }
            return false;
        },
        "clear": function () {
            this.ctx.clearRect(0, 0, this.height, this.width);
        },
        "renderObj": function (ctx, o) {
            var mtx = o._matrix;
            ctx.save();
            ctx.globalAlpha = o.complexAlpha;
            ctx.globalCompositeOperation = o.complexCompositeOperation;
            var mmyCanvas = o.cacheCanvas || o.txtCanvas || o.shapeCanvas;
            if (mmyCanvas) {
                ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                ctx.drawImage(mmyCanvas, 0, 0);
            } else if (o instanceof ARE.Bitmap || o instanceof ARE.Sprite) {
                var rect = o.rect;
                ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
            } else if (o instanceof ARE.Graphics || o instanceof ARE.Text) {
                ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
                o.draw(ctx);
            }
            ctx.restore();
        },
        "clearBackUpCanvasCache": function () { },
        "checkPointInAABB": function (x, y, AABB) {
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

    //end-------------------ARE.CanvasRenderer---------------------end

    //begin-------------------ARE.Dom---------------------begin

    ARE.Dom = Class.extend({
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

    //end-------------------ARE.Dom---------------------end

    //begin-------------------ARE.WebGLRenderer---------------------begin

    ARE.WebGLRenderer = Class.extend({
        "ctor": function (canvas) {
            this.surface = canvas;
            this.snapToPixel = true;
            this.canvasRenderer = new ARE.CanvasRenderer();
            this.textureCache = {};
            this.textureCanvasCache = {};
            this.initSurface(this.surface);
        },
        "initSurface": function (surface) {
            var options = {
                depth: false,
                alpha: true,
                preserveDrawingBuffer: true,
                antialias: false,
                premultipliedAlpha: true
            };
            var ctx = undefined;
            try {
                ctx = surface.ctx = surface.getContext("webgl", options) || surface.getContext("experimental-webgl", options);
                ctx.viewportWidth = surface.width;
                ctx.viewportHeight = surface.height;
            } catch (e) { }
            if (!ctx) {
                alert("Could not initialise WebGL. Make sure you've updated your browser, or try a different one like Google Chrome.");
            }
            var textureShader = ctx.createShader(ctx.FRAGMENT_SHADER);
            ctx.shaderSource(textureShader, "" + "precision mediump float;\n" + "varying vec3 vTextureCoord;\n" + "varying float vAlpha;\n" + "uniform float uAlpha;\n" + "uniform sampler2D uSampler0;\n" + "void main(void) { \n" + "vec4 color = texture2D(uSampler0, vTextureCoord.st);  \n" + "gl_FragColor = vec4(color.rgb, color.a * vAlpha);\n" + "}");
            ctx.compileShader(textureShader);
            if (!ctx.getShaderParameter(textureShader, ctx.COMPILE_STATUS)) {
                alert(ctx.getShaderInfoLog(textureShader));
            }
            var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
            ctx.shaderSource(vertexShader, "" + "attribute vec2 aVertexPosition;\n" + "attribute vec3 aTextureCoord;\n" + "attribute float aAlpha;\n" + "uniform bool uSnapToPixel;\n" + "const mat4 pMatrix = mat4(" + 2 / ctx.viewportWidth + ",0,0,0, 0," + -2 / ctx.viewportHeight + ",0,0, 0,0,-2,   0, -1,1,-1,1); \n" + "varying vec3 vTextureCoord;\n" + "varying float vAlpha;\n" + "void main(void) { \n" + "vTextureCoord = aTextureCoord; \n" + "vAlpha = aAlpha; \n" + "gl_Position = pMatrix * vec4(aVertexPosition.x,aVertexPosition.y,0.0, 1.0);\n" + "}");
            ctx.compileShader(vertexShader);
            if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) {
                alert(ctx.getShaderInfoLog(vertexShader));
            }
            var program = surface.shader = ctx.createProgram();
            ctx.attachShader(program, vertexShader);
            ctx.attachShader(program, textureShader);
            ctx.linkProgram(program);
            if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
                alert("Could not initialise shaders");
            }
            ctx.enableVertexAttribArray(program.vertexPositionAttribute = ctx.getAttribLocation(program, "aVertexPosition"));
            ctx.enableVertexAttribArray(program.uvCoordAttribute = ctx.getAttribLocation(program, "aTextureCoord"));
            ctx.enableVertexAttribArray(program.colorAttribute = ctx.getAttribLocation(program, "aAlpha"));
            program.alphaUniform = ctx.getUniformLocation(program, "uAlpha");
            program.snapToUniform = ctx.getUniformLocation(program, "uSnapToPixel");
            ctx.useProgram(program);
            this._vertexDataCount = 5;
            this._degToRad = Math.PI / 180;
            if (window.Float32Array) {
                this.vertices = new window.Float32Array(this._vertexDataCount * 4);
            } else {
                this.vertices = new Array(this._vertexDataCount * 4);
            }
            this.arrayBuffer = ctx.createBuffer();
            this.indexBuffer = ctx.createBuffer();
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
            ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            var byteCount = this._vertexDataCount * 4;
            ctx.vertexAttribPointer(program.vertexPositionAttribute, 2, ctx.FLOAT, 0, byteCount, 0);
            ctx.vertexAttribPointer(program.uvCoordAttribute, 2, ctx.FLOAT, 0, byteCount, 2 * 4);
            ctx.vertexAttribPointer(program.colorAttribute, 1, ctx.FLOAT, 0, byteCount, 4 * 4);
            if (window.Uint16Array) {
                this.indices = new window.Uint16Array(6);
            } else {
                this.indices = new Array(6);
            }
            for (var i = 0, l = this.indices.length; i < l; i += 6) {
                var j = i * 4 / 6;
                this.indices.set([j, j + 1, j + 2, j, j + 2, j + 3], i);
            }
            ctx.bufferData(ctx.ARRAY_BUFFER, this.vertices, ctx.STREAM_DRAW);
            ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, this.indices, ctx.STATIC_DRAW);
            ctx.viewport(0, 0, ctx.viewportWidth, ctx.viewportHeight);
            ctx.colorMask(true, true, true, true);
            ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, ctx.SRC_ALPHA, ctx.ONE);
            ctx.enable(ctx.BLEND);
            ctx.disable(ctx.DEPTH_TEST);
            surface.init = true;
            this.ctx = ctx;
        },
        "_initTexture": function (src, ctx) {
            if (!this.textureCache[src.src]) {
                src.glTexture = ctx.createTexture();
                src.glTexture.image = src;
                ctx.activeTexture(ctx.TEXTURE0);
                ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, src.glTexture.image);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                this.textureCache[src.src] = src.glTexture;
                ctx.uniform1i(ctx.getUniformLocation(ctx.canvas.shader, "uSampler0"), 0);
            } else {
                src.glTexture = this.textureCache[src.src];
                ctx.activeTexture(ctx.TEXTURE0);
                ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
            }
        },
        "_initCache": function (o, src, ctx) {
            if (!this.textureCanvasCache[o.cacheID]) {
                this.textureCanvasCache[this._preCacheId] = null;
                src.glTexture = ctx.createTexture();
                src.glTexture.image = src;
                ctx.activeTexture(ctx.TEXTURE0);
                ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, src.glTexture.image);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                ctx.uniform1i(ctx.getUniformLocation(ctx.canvas.shader, "uSampler0"), 0);
                this.textureCanvasCache[o.cacheID] = src.glTexture;
            } else {
                src.glTexture = this.textureCanvasCache[o.cacheID];
                ctx.activeTexture(ctx.TEXTURE0);
                ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
            }
        },
        "updateCache": function (ctx, o, w, h) {
            ctx.clearRect(0, 0, w + 1, h + 1);
            this.renderCache(ctx, o);
        },
        "renderCache": function (ctx, o) {
            if (!o.isVisible()) {
                return;
            }
            if (o instanceof ARE.Container || o instanceof ARE.Stage) {
                var list = o.children.slice(0);
                for (var i = 0, l = list.length; i < l; i++) {
                    ctx.save();
                    this.canvasRenderer.render(ctx, list[i]);
                    ctx.restore();
                }
            } else if (o instanceof ARE.Bitmap || o instanceof ARE.Sprite) {
                var rect = o.rect;
                ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
            } else if (o.txtCanvas) {
                ctx.drawImage(o.txtCanvas, 0, 0);
            } else if (o.shapeCanvas) {
                ctx.drawImage(o.shapeCanvas, 0, 0);
            }
        },
        "clear": function () {
            this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
        },
        "renderObj": function (ctx, o) {
            var mtx = o._matrix,
                leftSide = 0,
                topSide = 0,
                rightSide = 0,
                bottomSide = 0;
            var uFrame = 0,
                vFrame = 0,
                u = 1,
                v = 1,
                img = 0;
            if (o.complexCompositeOperation === "lighter") {
                ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
            } else {
                ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
            }
            var mmyCanvas = o.cacheCanvas || o.txtCanvas || o.shapeCanvas;
            if (mmyCanvas) {
                this._initCache(o, mmyCanvas, ctx);
                rightSide = leftSide + mmyCanvas.width;
                bottomSide = topSide + mmyCanvas.height;
            } else if (o instanceof ARE.Bitmap || o instanceof ARE.Sprite) {
                var rect = o.rect;
                img = o.img;
                this._initTexture(img, ctx);
                rightSide = leftSide + rect[2];
                bottomSide = topSide + rect[3];
                u = rect[2] / img.width;
                v = rect[3] / img.height;
                uFrame = rect[0] / img.width;
                vFrame = rect[1] / img.height;
            }
            var a = mtx.a,
                b = mtx.b,
                c = mtx.c,
                d = mtx.d,
                tx = mtx.tx,
                ty = mtx.ty,
                lma = leftSide * a,
                lmb = leftSide * b,
                tmc = topSide * c,
                tmd = topSide * d,
                rma = rightSide * a,
                rmb = rightSide * b,
                bmc = bottomSide * c,
                bmd = bottomSide * d;
            var alpha = o.complexAlpha;
            this.vertices.set([lma + tmc + tx, lmb + tmd + ty, uFrame, vFrame, alpha, lma + bmc + tx, lmb + bmd + ty, uFrame, vFrame + v, alpha, rma + bmc + tx, rmb + bmd + ty, uFrame + u, vFrame + v, alpha, rma + tmc + tx, rmb + tmd + ty, uFrame + u, vFrame, alpha], 0);
            ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.vertices);
            ctx.drawElements(ctx.TRIANGLES, 6, ctx.UNSIGNED_SHORT, 0);
        },
        "clearBackUpCanvasCache": function () {
            this.textureCanvasCache[1] = null;
        }
    });

    //end-------------------ARE.WebGLRenderer---------------------end

    //begin-------------------ARE.Matrix2D---------------------begin

    ARE.Matrix2D = Class.extend({
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
        "appendTransform": function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation % 360) {
                var r = rotation * ARE.Matrix2D.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }
            if (skewX || skewY) {
                skewX *= ARE.Matrix2D.DEG_TO_RAD;
                skewY *= ARE.Matrix2D.DEG_TO_RAD;
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
        "initialize": function (a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        },
        "setValues": function (a, b, c, d, tx, ty) {
            this.a = a == null ? 1 : a;
            this.b = b || 0;
            this.c = c || 0;
            this.d = d == null ? 1 : d;
            this.tx = tx || 0;
            this.ty = ty || 0;
            return this;
        },
        "copy": function (matrix) {
            return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        }
    });

    //end-------------------ARE.Matrix2D---------------------end

    //begin-------------------ARE.Loader---------------------begin

    ARE.Loader = Class.extend({
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

    //end-------------------ARE.Loader---------------------end

    //begin-------------------ARE.Observable---------------------begin

    ARE.Observable = Class.extend({
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
                    if (arr && ARE.Observable.isInArray(arr, prop) || !arr) {
                        this.watch(target, prop);
                    }
                }
            }
            if (target.change) throw "naming conflicts！observable will extend 'change' method to your object .";
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
            ARE.Observable.methods.forEach(function (item) {
                target[item] = function () {
                    var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                    for (var cprop in this) {
                        if (this.hasOwnProperty(cprop) && cprop != "_super" && !ARE.Observable.isFunction(this[cprop])) {
                            self.watch(this, cprop);
                        }
                    }
                    if (new RegExp("\\b" + item + "\\b").test(ARE.Observable.triggerStr)) {
                        self.onPropertyChanged("array", item);
                    }
                    return result;
                };
            });
        },
        "watch": function (target, prop) {
            if (prop.substr(0, 2) == "__") return;
            var self = this;
            if (ARE.Observable.isFunction(target[prop])) return;
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
            if (ARE.Observable.isArray(target)) {
                this.mock(target);
            }
            if (typeof currentValue == "object") {
                if (ARE.Observable.isArray(currentValue)) {
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

    //end-------------------ARE.Observable---------------------end

    //begin-------------------ARE.RAF---------------------begin

    ARE.RAF = Class.extend({
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

    //end-------------------ARE.RAF---------------------end

    //begin-------------------ARE.To---------------------begin

    ARE.To = Class.extend({
        "statics": {
            "ctor": function () {
                var self = this;
                setTimeout(function () {
                    self.bounceOut = ARE.TWEEN.Easing.Bounce.Out,
                    self.linear = ARE.TWEEN.Easing.Linear.None,
                    self.quadraticIn = ARE.TWEEN.Easing.Quadratic.In,
                    self.quadraticOut = ARE.TWEEN.Easing.Quadratic.Out,
                    self.quadraticInOut = ARE.TWEEN.Easing.Quadratic.InOut,
                    self.cubicIn = ARE.TWEEN.Easing.Cubic.In,
                    self.cubicOut = ARE.TWEEN.Easing.Cubic.Out,
                    self.cubicInOut = ARE.TWEEN.Easing.Cubic.InOut,
                    self.quarticIn = ARE.TWEEN.Easing.Quartic.In,
                    self.quarticOut = ARE.TWEEN.Easing.Quartic.Out,
                    self.quarticInOut = ARE.TWEEN.Easing.Quartic.InOut,
                    self.quinticIn = ARE.TWEEN.Easing.Quintic.In,
                    self.quinticOut = ARE.TWEEN.Easing.Quintic.Out,
                    self.quinticInOut = ARE.TWEEN.Easing.Quintic.InOut,
                    self.sinusoidalIn = ARE.TWEEN.Easing.Sinusoidal.In,
                    self.sinusoidalOut = ARE.TWEEN.Easing.Sinusoidal.Out,
                    self.sinusoidalInOut = ARE.TWEEN.Easing.Sinusoidal.InOut,
                    self.exponentialIn = ARE.TWEEN.Easing.Exponential.In,
                    self.exponentialOut = ARE.TWEEN.Easing.Exponential.Out,
                    self.exponentialInOut = ARE.TWEEN.Easing.Exponential.InOut,
                    self.circularIn = ARE.TWEEN.Easing.Circular.In,
                    self.circularOut = ARE.TWEEN.Easing.Circular.Out,
                    self.circularInOut = ARE.TWEEN.Easing.Circular.InOut,
                    self.elasticIn = ARE.TWEEN.Easing.Elastic.In,
                    self.elasticOut = ARE.TWEEN.Easing.Elastic.Out,
                    self.elasticInOut = ARE.TWEEN.Easing.Elastic.InOut,
                    self.backIn = ARE.TWEEN.Easing.Back.In,
                    self.backOut = ARE.TWEEN.Easing.Back.Out,
                    self.backInOut = ARE.TWEEN.Easing.Back.InOut,
                    self.bounceIn = ARE.TWEEN.Easing.Bounce.In,
                    self.bounceOut = ARE.TWEEN.Easing.Bounce.Out,
                    self.bounceInOut = ARE.TWEEN.Easing.Bounce.InOut,
                    self.interpolationLinear = ARE.TWEEN.Interpolation.Linear,
                    self.interpolationBezier = ARE.TWEEN.Interpolation.Bezier,
                    self.interpolationCatmullRom = ARE.TWEEN.Interpolation.CatmullRom;
                }, 0);
            },
            "get": function (element) {
                return new this(element);
            }
        },
        "ctor": function (element) {
            this.element = element;
            this.cmds = [];
            this.index = 0;
            this.tweens = [];
            this._pause = false;
            this.loop = setInterval(function () {
                ARE.TWEEN.update();
            }, 15);
            this.cycleCount = 0;
        },
        "to": function () {
            this.cmds.push(["to"]);
            return this;
        },
        "set": function (prop, value, time, ease) {
            this.cmds[this.cmds.length - 1].push([prop, [value, time, ease]]);
            return this;
        },
        "x": function () {
            this.cmds[this.cmds.length - 1].push(["x", arguments]);
            return this;
        },
        "y": function () {
            this.cmds[this.cmds.length - 1].push(["y", arguments]);
            return this;
        },
        "z": function () {
            this.cmds[this.cmds.length - 1].push(["z", arguments]);
            return this;
        },
        "rotation": function () {
            this.cmds[this.cmds.length - 1].push(["rotation", arguments]);
            return this;
        },
        "scaleX": function () {
            this.cmds[this.cmds.length - 1].push(["scaleX", arguments]);
            return this;
        },
        "scaleY": function () {
            this.cmds[this.cmds.length - 1].push(["scaleY", arguments]);
            return this;
        },
        "skewX": function () {
            this.cmds[this.cmds.length - 1].push(["skewX", arguments]);
            return this;
        },
        "skewY": function () {
            this.cmds[this.cmds.length - 1].push(["skewY", arguments]);
            return this;
        },
        "originX": function () {
            this.cmds[this.cmds.length - 1].push(["originX", arguments]);
            return this;
        },
        "originY": function () {
            this.cmds[this.cmds.length - 1].push(["originY", arguments]);
            return this;
        },
        "alpha": function () {
            this.cmds[this.cmds.length - 1].push(["alpha", arguments]);
            return this;
        },
        "begin": function (fn) {
            this.cmds[this.cmds.length - 1].begin = fn;
            return this;
        },
        "progress": function (fn) {
            this.cmds[this.cmds.length - 1].progress = fn;
            return this;
        },
        "end": function (fn) {
            this.cmds[this.cmds.length - 1].end = fn;
            return this;
        },
        "wait": function () {
            this.cmds.push(["wait", arguments]);
            return this;
        },
        "then": function () {
            this.cmds.push(["then", arguments]);
            return this;
        },
        "cycle": function () {
            this.cmds.push(["cycle", arguments]);
            return this;
        },
        "shake": function () {
            this.cmds = this.cmds.concat([["to", ["x", {
                "0": 10,
                "1": 50
            }]], ["to", ["x", {
                "0": -10,
                "1": 50
            }]], ["to", ["x", {
                "0": 10,
                "1": 50
            }]], ["to", ["x", {
                "0": -10,
                "1": 50
            }]], ["to", ["x", {
                "0": 10,
                "1": 50
            }]], ["to", ["x", {
                "0": -10,
                "1": 50
            }]], ["to", ["x", {
                "0": 10,
                "1": 50
            }]], ["to", ["x", {
                "0": -10,
                "1": 50
            }]], ["to", ["x", {
                "0": 10,
                "1": 50
            }]], ["to", ["x", {
                "0": -10,
                "1": 50
            }]], ["to", ["x", {
                "0": 10,
                "1": 50
            }]], ["to", ["x", {
                "0": 0,
                "1": 50
            }]]]);
            return this;
        },
        "rubber": function () {
            this.cmds = this.cmds.concat([["to", ["scaleX", {
                "0": 1.25,
                "1": 300
            }], ["scaleY", {
                "0": .75,
                "1": 300
            }]], ["to", ["scaleX", {
                "0": .75,
                "1": 100
            }], ["scaleY", {
                "0": 1.25,
                "1": 100
            }]], ["to", ["scaleX", {
                "0": 1.15,
                "1": 100
            }], ["scaleY", {
                "0": .85,
                "1": 100
            }]], ["to", ["scaleX", {
                "0": .95,
                "1": 150
            }], ["scaleY", {
                "0": 1.05,
                "1": 150
            }]], ["to", ["scaleX", {
                "0": 1.05,
                "1": 100
            }], ["scaleY", {
                "0": .95,
                "1": 100
            }]], ["to", ["scaleX", {
                "0": 1,
                "1": 250
            }], ["scaleY", {
                "0": 1,
                "1": 250
            }]]]);
            return this;
        },
        "bounceIn": function () {
            this.cmds = this.cmds.concat([["to", ["scaleX", {
                "0": 0,
                "1": 0
            }], ["scaleY", {
                "0": 0,
                "1": 0
            }]], ["to", ["scaleX", {
                "0": 1.35,
                "1": 200
            }], ["scaleY", {
                "0": 1.35,
                "1": 200
            }]], ["to", ["scaleX", {
                "0": .9,
                "1": 100
            }], ["scaleY", {
                "0": .9,
                "1": 100
            }]], ["to", ["scaleX", {
                "0": 1.1,
                "1": 100
            }], ["scaleY", {
                "0": 1.1,
                "1": 100
            }]], ["to", ["scaleX", {
                "0": .95,
                "1": 100
            }], ["scaleY", {
                "0": .95,
                "1": 100
            }]], ["to", ["scaleX", {
                "0": 1,
                "1": 100
            }], ["scaleY", {
                "0": 1,
                "1": 100
            }]]]);
            return this;
        },
        "flipInX": function () {
            this.cmds = this.cmds.concat([["to", ["rotateX", {
                "0": -90,
                "1": 0
            }]], ["to", ["rotateX", {
                "0": 20,
                "1": 300
            }]], ["to", ["rotateX", {
                "0": -20,
                "1": 300
            }]], ["to", ["rotateX", {
                "0": 10,
                "1": 300
            }]], ["to", ["rotateX", {
                "0": -5,
                "1": 300
            }]], ["to", ["rotateX", {
                "0": 0,
                "1": 300
            }]]]);
            return this;
        },
        "zoomOut": function () {
            this.cmds = this.cmds.concat([["to", ["scaleX", {
                "0": 0,
                "1": 400
            }], ["scaleY", {
                "0": 0,
                "1": 400
            }]]]);
            return this;
        },
        "start": function () {
            if (this._pause) return;
            var len = this.cmds.length;
            if (this.index < len) {
                this.exec(this.cmds[this.index], this.index == len - 1);
            } else {
                clearInterval(this.loop);
            }
            return this;
        },
        "pause": function () {
            this._pause = true;
            for (var i = 0, len = this.tweens.length; i < len; i++) {
                this.tweens[i].pause();
            }
            if (this.currentTask == "wait") {
                this.timeout -= new Date() - this.currentTaskBegin;
                this.currentTaskBegin = new Date();
            }
        },
        "togglePlayPause": function () {
            if (this._pause) {
                this.play();
            } else {
                this.pause();
            }
        },
        "play": function () {
            this._pause = false;
            for (var i = 0, len = this.tweens.length; i < len; i++) {
                this.tweens[i].play();
            }
            var self = this;
            if (this.currentTask == "wait") {
                setTimeout(function () {
                    if (self._pause) return;
                    self.index++;
                    self.start();
                    if (self.index == self.cmds.length && self.complete) self.complete();
                }, this.timeout);
            }
        },
        "exec": function (cmd, last) {
            var len = cmd.length,
                self = this;
            this.currentTask = cmd[0];
            switch (this.currentTask) {
                case "to":
                    self.stepCompleteCount = 0;
                    for (var i = 1; i < len; i++) {
                        var task = cmd[i];
                        var ease = task[1][2];
                        var target = {};
                        var prop = task[0];
                        target[prop] = task[1][0];
                        var t = new ARE.TWEEN.Tween(this.element).to(target, task[1][1]).onStart(function () {
                            if (cmd.start) cmd.start();
                        }).onUpdate(function () {
                            if (cmd.progress) cmd.progress.call(self.element);
                            self.element[prop] = this[prop];
                        }).easing(ease ? ease : ARE.To.linear).onComplete(function () {
                            self.stepCompleteCount++;
                            if (self.stepCompleteCount == len - 1) {
                                if (cmd.end) cmd.end.call(self.element);
                                if (last && self.complete) self.complete();
                                self.index++;
                                self.start();
                            }
                        }).start();
                        this.tweens.push(t);
                    }
                    break;
                case "wait":
                    this.currentTaskBegin = new Date();
                    this.timeout = cmd[1][0];
                    setTimeout(function () {
                        if (self._pause) return;
                        self.index++;
                        self.start();
                        if (last && self.complete) self.complete();
                    }, cmd[1][0]);
                    break;
                case "then":
                    var arg = cmd[1][0];
                    arg.index = 0;
                    arg.complete = function () {
                        self.index++;
                        self.start();
                        if (last && self.complete) self.complete();
                    };
                    arg.start();
                    break;
                case "cycle":
                    var count = cmd[1][1];
                    if (count && self.cycleCount == count) {
                        self.index++;
                        self.start();
                        if (last && self.complete) self.complete();
                    } else {
                        self.cycleCount++;
                        self.index = cmd[1][0];
                        self.start();
                    }
                    break;
            }
        }
    });

    //end-------------------ARE.To---------------------end

    //begin-------------------ARE.UID---------------------begin

    ARE.UID = Class.extend({
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

    //end-------------------ARE.UID---------------------end

    //begin-------------------ARE.Util---------------------begin

    ARE.Util = Class.extend({
        "statics": {
            "random": function (min, max) {
                return min + Math.floor(Math.random() * (max - min + 1));
            }
        }
    });

    //end-------------------ARE.Util---------------------end

    //begin-------------------ARE.TWEEN---------------------begin

    ARE.TWEEN = Class.extend({
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
                var _easingFunction = ARE.TWEEN.Easing.Linear.None;
                var _interpolationFunction = ARE.TWEEN.Interpolation.Linear;
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
                    ARE.TWEEN.add(this);
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
                    ARE.TWEEN.remove(this);
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
                        return 1 - ARE.TWEEN.Easing.Bounce.Out(1 - k);
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
                        if (k < .5) return ARE.TWEEN.Easing.Bounce.In(k * 2) * .5;
                        return ARE.TWEEN.Easing.Bounce.Out(k * 2 - 1) * .5 + .5;
                    }
                }
            },
            "Interpolation": {
                "Linear": function (v, k) {
                    var m = v.length - 1,
                        f = m * k,
                        i = Math.floor(f),
                        fn = ARE.TWEEN.Interpolation.Utils.Linear;
                    if (k < 0) return fn(v[0], v[1], f);
                    if (k > 1) return fn(v[m], v[m - 1], m - f);
                    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
                },
                "Bezier": function (v, k) {
                    var b = 0,
                        n = v.length - 1,
                        pw = Math.pow,
                        bn = ARE.TWEEN.Interpolation.Utils.Bernstein,
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
                        fn = ARE.TWEEN.Interpolation.Utils.CatmullRom;
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
                        var fc = ARE.TWEEN.Interpolation.Utils.getFactorial();
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

    //end-------------------ARE.TWEEN---------------------end

    //begin-------------------ARE.Vector2---------------------begin

    ARE.Vector2 = Class.extend({
        "ctor": function (x, y) {
            this.x = x;
            this.y = y;
        },
        "copy": function () {
            return new ARE.Vector2(this.x, this.y);
        },
        "length": function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        "sqrLength": function () {
            return this.x * this.x + this.y * this.y;
        },
        "normalize": function () {
            var inv = 1 / this.length();
            return new ARE.Vector2(this.x * inv, this.y * inv);
        },
        "negate": function () {
            return new ARE.Vector2(-this.x, -this.y);
        },
        "add": function (v) {
            this.x += v.x,
            this.y += v.y;
        },
        "subtract": function (v) {
            return new ARE.Vector2(this.x - v.x, this.y - v.y);
        },
        "multiply": function (f) {
            return new ARE.Vector2(this.x * f, this.y * f);
        },
        "divide": function (f) {
            var invf = 1 / f;
            return new ARE.Vector2(this.x * invf, this.y * invf);
        },
        "dot": function (v) {
            return this.x * v.x + this.y * v.y;
        }
    });

    //end-------------------ARE.Vector2---------------------end

    //begin-------------------ARE.Label---------------------begin

    ARE.Label = ARE.DisplayObject.extend({
        "ctor": function (option) {
            this._super();
            this.value = option.value;
            this.fontSize = option.fontSize;
            this.fontFamily = option.fontFamily;
            this.color = option.color;
            this.textAlign = "center";
            this.textBaseline = "top";
            this.maxWidth = option.maxWidth || 2e3;
            this.square = option.square || false;
            this.txtCanvas = document.createElement("canvas");
            this.txtCtx = this.txtCanvas.getContext("2d");
            this.setDrawOption();
            this._watch(this, ["value", "fontSize", "color", "fontFamily"], function (a, b) {
                this.setDrawOption();
            });
        },
        "setDrawOption": function () {
            var drawOption = this.getDrawOption({
                txt: this.value,
                maxWidth: this.maxWidth,
                square: this.square,
                size: this.fontSize,
                alignment: this.textAlign,
                color: this.color || "black",
                fontFamily: this.fontFamily
            });
            this.cacheID = ARE.UID.getCacheID();
            this.width = drawOption.calculatedWidth;
            this.height = drawOption.calculatedHeight;
        },
        "getDrawOption": function (option) {
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
            var backgroundColour = option.backgroundColour;
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
        }
    });

    //end-------------------ARE.Label---------------------end

    //begin-------------------ARE.Renderer---------------------begin

    ARE.Renderer = Class.extend({
        "ctor": function (stage, closegl) {
            this.stage = stage;
            this.objs = [];
            this.width = this.stage.width;
            this.height = this.stage.height;
            this.mainCanvas = this.stage.canvas;
            var canvasSupport = !!window.CanvasRenderingContext2D,
                webglSupport = function () {
                    try {
                        var canvas = document.createElement("canvas");
                        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
                    } catch (e) {
                        return false;
                    }
                }();
            if (webglSupport && !closegl) {
                this.renderingEngine = new ARE.WebGLRenderer(this.stage.canvas);
            } else {
                if (canvasSupport) {
                    this.renderingEngine = new ARE.CanvasRenderer(this.stage.canvas);
                } else {
                    throw "your browser does not support canvas and webgl ";
                }
            }
            this.mainCtx = this.renderingEngine.ctx;
        },
        "update": function () {
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
        "computeMatrix": function () {
            for (var i = 0, len = this.stage.children.length; i < len; i++) {
                this._computeMatrix(this.stage.children[i]);
            }
        },
        "initComplex": function (o) {
            o.complexCompositeOperation = this._getCompositeOperation(o);
            o.complexAlpha = this._getAlpha(o, 1);
        },
        "_computeMatrix": function (o, mtx) {
            if (!o.isVisible()) {
                return;
            }
            if (mtx) {
                o._matrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            } else {
                o._matrix.initialize(1, 0, 0, 1, 0, 0);
            }
            if (o instanceof ARE.Shape) {
                o._matrix.appendTransform(o.x, o.y, 1, 1, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            } else {
                o._matrix.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            }
            if (o instanceof ARE.Container) {
                var list = o.children,
                    len = list.length,
                    i = 0;
                for (; i < len; i++) {
                    this._computeMatrix(list[i], o._matrix);
                }
            } else {
                if (o instanceof ARE.Graphics || o instanceof ARE.Text) {
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
        "_getCompositeOperation": function (o) {
            if (o.compositeOperation) return o.compositeOperation;
            if (o.parent) return this._getCompositeOperation(o.parent);
        },
        "_getAlpha": function (o, alpha) {
            var result = o.alpha * alpha;
            if (o.parent) {
                return this._getAlpha(o.parent, result);
            }
            return result;
        },
        "isInStage": function (o) {
            return this.collisionBetweenAABB(o.AABB, this.stage.AABB);
        },
        "collisionBetweenAABB": function (AABB1, AABB2) {
            var maxX = AABB1[0] + AABB1[2];
            if (maxX < AABB2[0]) return false;
            var minX = AABB1[0];
            if (minX > AABB2[0] + AABB2[2]) return false;
            var maxY = AABB1[1] + AABB1[3];
            if (maxY < AABB2[1]) return false;
            var maxY = AABB1[1];
            if (maxY > AABB2[1] + AABB2[3]) return false;
            return true;
        }
    });

    //end-------------------ARE.Renderer---------------------end

    //begin-------------------ARE.Graphics---------------------begin

    ARE.Graphics = ARE.DisplayObject.extend({
        "ctor": function () {
            this._super();
            this.cmds = [];
            this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];
        },
        "draw": function (ctx) {
            for (var i = 0, len = this.cmds.length; i < len; i++) {
                var cmd = this.cmds[i];
                if (this.assMethod.join("-").match(new RegExp("\\b" + cmd[0] + "\\b", "g"))) {
                    ctx[cmd[0]] = cmd[1][0];
                } else {
                    ctx[cmd[0]].apply(ctx, Array.prototype.slice.call(cmd[1]));
                }
            }
        },
        "clearRect": function (x, y, width, height) {
            this.cmds.push(["clearRect", arguments]);
            return this;
        },
        "clear": function () {
            this.cmds.length = 0;
            return this;
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

    //end-------------------ARE.Graphics---------------------end

    //begin-------------------ARE.Keyboard---------------------begin

    ARE.Keyboard = Class.extend({
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

    //end-------------------ARE.Keyboard---------------------end
    if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = ARE }
    else if (typeof define === 'function' && define.amd) { define(ARE) }
    else { win.ARE = ARE };
})(Function('return this')());
