//create by kmdjs   https://github.com/kmdjs/kmdjs 
(function (win) {
    var initializing = !1, fnTest = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/, __class = function () { }; __class.extend = function (n) { function i() { !initializing && this.ctor && this.ctor.apply(this, arguments) } var f = this.prototype, u, r, t; initializing = !0, u = new this, initializing = !1; for (t in n) t != "statics" && (u[t] = typeof n[t] == "function" && typeof f[t] == "function" && fnTest.test(n[t]) ? function (n, t) { return function () { var r = this._super, i; return this._super = f[n], i = t.apply(this, arguments), this._super = r, i } }(t, n[t]) : n[t]); for (r in this) this.hasOwnProperty(r) && r != "extend" && (i[r] = this[r]); if (i.prototype = u, n.statics) for (t in n.statics) n.statics.hasOwnProperty(t) && (i[t] = n.statics[t], t == "ctor" && i[t]()); return i.prototype.constructor = i, i.extend = arguments.callee, i.implement = function (n) { for (var t in n) u[t] = n[t] }, i };

    ; (function () {
        var ARE = {};
        //begin-------------------ARE.UID---------------------begin

        ARE.UID = __class.extend({
            "statics": {
                "_nextID": 0,
                "get": function () {
                    return this._nextID++;
                }
            }
        });

        //end-------------------ARE.UID---------------------end

        //begin-------------------ARE.DisplayObject---------------------begin

        ARE.DisplayObject = __class.extend({
            "ctor": function () {
                this.alpha = this.scaleX = this.scaleY = 1;
                this.x = this.y = this.rotation = this.originX = this.originY = this.skewX = this.skewY = this.width = this.height = 0;
                this.visible = true;
                this._matrix = new ARE.Matrix2D();
                this.events = {};
                this.id = ARE.UID.get();
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
                ["mouseover", "mousemove", "mouseout", "touchstart", "touchmove", "touchend"].join("_").match(type) && (ARE.Stage.checkMove = true);
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
            "cache": function (x, y, width, height) {
                if (!this.cacheCanvas) {
                    this.cacheCanvas = document.createElement("canvas");
                    var bound = this.getBound();
                    this.cacheCanvas.width = bound.width;
                    this.cacheCanvas.height = bound.height;
                    this.cacheCtx = this.cacheCanvas.getContext("2d");
                }
                ARE.Stage.renderer.updateCache(this.cacheCtx, this, width, height);
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

        //end-------------------ARE.DisplayObject---------------------end

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
                this.img = this.option.imgs[0];
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
                ARE.RAF.clearRequestInterval(this.loop);
                this.currentAnimation = animation;
                var self = this;
                var playTimes = 0;
                this.loop = ARE.RAF.requestInterval(function () {
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
                                ARE.RAF.clearRequestInterval(self.loop);
                                self.parent.remove(self);
                            }
                        }
                        self.rect = opt.frames[frames[self.animationFrameIndex]];
                        if (self.rect.length > 4) self.img = opt.imgs[self.rect[4]];
                    }
                }, this.interval);
            },
            "gotoAndStop": function (animation) {
                this.reset();
                ARE.RAF.clearRequestInterval(this.loop);
                var self = this;
                self.currentAnimation = animation;
                var opt = self.option;
                var frames = opt.animations[self.currentAnimation].frames,
                    len = frames.length;
                self.rect = opt.frames[frames[self.animationFrameIndex]];
                if (self.rect.length > 4) self.img = opt.imgs[self.rect[4]];
            }
        });

        //end-------------------ARE.Sprite---------------------end

        //begin-------------------ARE.Shape---------------------begin

        ARE.Shape = ARE.DisplayObject.extend({
            "ctor": function () {
                this._super();
                this.cmds = [];
                this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];
            },
            "setBound": function (w, h) {
                this.width = w;
                this.height = h;
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
            }
        });

        //end-------------------ARE.Container---------------------end

        //begin-------------------ARE.Stage---------------------begin

        ARE.Stage = ARE.Container.extend({
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
                if (webglSupport && !closegl) {
                    this.renderer = new ARE.WebGLRenderer(this);
                } else {
                    this.ctx = this.canvas.getContext("2d");
                    this.renderer = new ARE.CanvasRenderer(this);
                }
                ARE.Stage.renderer = this.renderer;
                this.hitRenderer = new ARE.CanvasRenderer(this);
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
                this.canvas.addEventListener("click", this._handleClick.bind(this), false);
                this.canvas.addEventListener("mousemove", this._handleMouseMove.bind(this), false);
                window.addEventListener("keydown", this._handleKeyDown.bind(this), false);
                window.addEventListener("keyup", this._handleKeyUp.bind(this), false);
                this.offset = this._getXY(this.canvas);
                this.overObj = null;
                this.pause = false;
                this.interval = Math.floor(1e3 / 60);
                var self = this;
                self.loop = ARE.RAF.requestInterval(function () {
                    self._tick(self);
                }, self.interval);
            },
            "update": function () {
                if (!this.pause) {
                    this.renderer.update();
                }
            },
            "_handleKeyDown": function (evt) {
                this.keyDownCallback && this.keyDownCallback(evt.keyCode);
            },
            "_handleKeyUp": function (evt) {
                this.keyUpCallback && this.keyUpCallback(evt.keyCode);
            },
            "_handleClick": function (evt) {
                evt.stageX = evt.pageX - this.offset[0];
                evt.stageY = evt.pageY - this.offset[1];
                var callbacks = this.events["click"];
                if (callbacks) {
                    for (var i = 0, len = callbacks.length; i < len; i++) {
                        var callback = callbacks[i];
                        callback(evt);
                    }
                }
                var child = this.hitRenderer.hitRender(this.hitCtx, this, null, evt.pageX - this.offset[0], evt.pageY - this.offset[1], "click");
            },
            "_handleMouseMove": function (evt) {
                evt.stageX = evt.pageX - this.offset[0];
                evt.stageY = evt.pageY - this.offset[1];
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
                        if (itv > container._tickInterval) {
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
                            if (itv > child._tickInterval) {
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
            },
            "onTick": function (fn) {
                this.tickFn = fn;
            },
            "setFPS": function (fps) {
                this.interval = Math.floor(1e3 / fps);
            },
            "onKeyDown": function (fn) {
                this.keyDownCallback = fn;
            },
            "onKeyUp": function (fn) {
                this.keyUpCallback = fn;
            },
            "onKeyboard": function (keyCombo, onDownCallback, onUpCallback) {
                ARE.Keyboard.on(keyCombo, onDownCallback, onUpCallback);
            },
            "getActiveKeys": function () {
                return ARE.Keyboard.getActiveKeys();
            }
        });

        //end-------------------ARE.Stage---------------------end

        //begin-------------------ARE.Matrix2D---------------------begin

        ARE.Matrix2D = __class.extend({
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

        //end-------------------ARE.Matrix2D---------------------end

        //begin-------------------ARE.Txt---------------------begin

        ARE.Txt = ARE.DisplayObject.extend({
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
                var t = new ARE.Txt(this.text, this.font, this.color);
                this.cloneProps(t);
                return t;
            }
        });

        //end-------------------ARE.Txt---------------------end

        //begin-------------------ARE.Loader---------------------begin

        ARE.Loader = __class.extend({
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

        //begin-------------------ARE.Bitmap---------------------begin

        ARE.Bitmap = ARE.DisplayObject.extend({
            "ctor": function (img) {
                this._super();
                if (typeof img == "string") {
                    var self = this;
                    this.visible = false;
                    this.img = document.createElement("img");
                    this.img.onload = function () {
                        self.visible = true;
                        if (!self.rect) self.rect = [0, 0, self.img.width, self.img.height];
                        self.width = self.rect[2];
                        self.height = self.rect[3];
                        self.regX = self.width * self.originX;
                        self.regY = self.height * self.originY;
                    };
                    this.img.src = img;
                } else {
                    this.img = img;
                    this.rect = [0, 0, img.width, img.height];
                    this.width = img.width;
                    this.height = img.height;
                }
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
            "setRect": function (x, y, w, h) {
                this.rect = [x, y, w, h];
                this.width = w;
                this.height = h;
            },
            "clone": function () {
                var o = new ARE.Bitmap(this.img);
                o.rect = this.rect.slice(0);
                this.cloneProps(o);
                return o;
            }
        });

        //end-------------------ARE.Bitmap---------------------end

        //begin-------------------ARE.CanvasRenderer---------------------begin

        ARE.CanvasRenderer = __class.extend({
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
                if (mtx) {
                    o._matrix.reinitialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty, mtx.alpha, mtx.shadow, mtx.compositeOperation);
                } else {
                    o._matrix.reinitialize(1, 0, 0, 1, 0, 0);
                }
                mtx = o._matrix;
                mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
                var a = ctx.globalAlpha,
                    cp = ctx.globalCompositeOperation;
                ctx.globalAlpha *= o.alpha;
                ctx.globalCompositeOperation = o.compositeOperation;
                var mmyCanvas = o.cacheCanvas || o.txtCanvas;
                if (mmyCanvas) {
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx + .5 | 0, mtx.ty + .5 | 0);
                    ctx.drawImage(mmyCanvas, 0, 0);
                } else if (o instanceof ARE.Container || o instanceof ARE.Stage) {
                    var list = o.children.slice(0);
                    for (var i = 0, l = list.length; i < l; i++) {
                        ctx.save();
                        this.render(ctx, list[i], mtx);
                        ctx.restore();
                    }
                } else if (o instanceof ARE.Bitmap || o instanceof ARE.Sprite) {
                    var rect = o.rect;
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx + .5 | 0, mtx.ty + .5 | 0);
                    ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
                } else if (o instanceof ARE.Shape) {
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx + .5 | 0, mtx.ty + .5 | 0);
                    for (var i = 0, len = o.cmds.length; i < len; i++) {
                        var cmd = o.cmds[i];
                        if (o.assMethod.join("-").match(new RegExp("\\b" + cmd[0] + "\\b", "g"))) {
                            ctx[cmd[0]] = cmd[1][0];
                        } else {
                            ctx[cmd[0]].apply(ctx, Array.prototype.slice.call(cmd[1]));
                        }
                    }
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
                mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
                var list = o.children.slice(0),
                    l = list.length;
                for (var i = l - 1; i >= 0; i--) {
                    var child = list[i];
                    mtx.reinitialize(1, 0, 0, 1, 0, 0);
                    mtx.appendTransform(o.x - x, o.y - y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
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
                mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
                var a = ctx.globalAlpha;
                ctx.globalAlpha *= o.alpha;
                if (o.cacheCanvas) {
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx + .5 | 0, mtx.ty + .5 | 0);
                    ctx.drawImage(o.cacheCanvas || o.img, 0, 0);
                } else if (o instanceof ARE.Container) {
                    var list = o.children.slice(0),
                        l = list.length;
                    for (var i = l - 1; i >= 0; i--) {
                        var child = list[i];
                        ctx.save();
                        var child = list[i];
                        this._hitRender(ctx, list[i], mtx);
                        ctx.restore();
                        if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
                            child.execEvent(type);
                        }
                    }
                } else if (o instanceof ARE.Bitmap || o instanceof ARE.Sprite) {
                    var rect = o.rect;
                    ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx + .5 | 0, mtx.ty + .5 | 0);
                    ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
                }
                ctx.globalAlpha = a;
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
                } else if (o instanceof ARE.Shape) {
                    for (var i = 0, len = o.cmds.length; i < len; i++) {
                        var cmd = o.cmds[i];
                        if (o.assMethod.join("-").match(new RegExp("\\b" + cmd[0] + "\\b", "g"))) {
                            ctx[cmd[0]] = cmd[1][0];
                        } else {
                            ctx[cmd[0]].apply(ctx, Array.prototype.slice.call(cmd[1]));
                        }
                    }
                }
            }
        });

        //end-------------------ARE.CanvasRenderer---------------------end

        //begin-------------------ARE.WebGLRenderer---------------------begin

        ARE.WebGLRenderer = __class.extend({
            "ctor": function (root) {
                this.root = root;
                this.surface = root.canvas;
                this.MAX_DEPTH = 1048576;
                this.snapToPixel = true;
                this.canvasRenderer = new ARE.CanvasRenderer();
            },
            "getSurface": function (width, height) {
                if (this.surface == null) {
                    this.surface = document.createElement("canvas");
                }
                if (width) {
                    this.surface.width = width;
                }
                if (height) {
                    this.surface.height = height;
                }
                return this.surface;
            },
            "clear": function () {
                if (!this.surface) {
                    return;
                }
                if (!this.surface.init) {
                    this.initSurface(this.surface);
                }
            },
            "initSurface": function (surface) {
                var ctx = undefined;
                try {
                    ctx = surface.ctx = surface.getContext("experimental-webgl", {
                        preserveDrawingBuffer: true
                    });
                    ctx.viewportWidth = surface.width;
                    ctx.viewportHeight = surface.height;
                } catch (e) { }
                if (!ctx) {
                    alert("Could not initialise WebGL. Make sure you've updated your browser, or try a different one like Google Chrome.");
                }
                surface.idMatrix = ARE.GLMatrix.mat4.create();
                surface.orthMatrix = ARE.GLMatrix.mat4.create();
                this._matPool = [];
                var textureShader = ctx.createShader(ctx.FRAGMENT_SHADER);
                ctx.shaderSource(textureShader, "" + "precision highp float;\n" + "varying vec3 vTextureCoord;\n" + "varying float vAlpha;\n" + "uniform float uAlpha;\n" + "uniform sampler2D uSampler0,uSampler1,uSampler2,uSampler3,uSampler4,uSampler5,uSampler6," + "uSampler7,uSampler8,uSampler9,uSampler10,uSampler11,uSampler12,uSampler13,uSampler14,uSampler15;\n" + "void main(void) { \n" + "int sampler = int(vTextureCoord.z); \n" + "vec4 color;\n" + "vec2 coord = vec2(vTextureCoord.s, vTextureCoord.t);\n" + " if (sampler == 0) { color = texture2D(uSampler0, coord); } \n" + "else if (sampler == 1) { color = texture2D(uSampler1, coord); } \n" + "else if (sampler == 2) { color = texture2D(uSampler2, coord); } \n" + "else if (sampler == 3) { color = texture2D(uSampler3, coord); } \n" + "else if (sampler == 4) { color = texture2D(uSampler4, coord); } \n" + "else if (sampler == 5) { color = texture2D(uSampler5, coord); } \n" + "else if (sampler == 6) { color = texture2D(uSampler6, coord); } \n" + "else if (sampler == 7) { color = texture2D(uSampler7, coord); } \n" + "else if (sampler == 8) { color = texture2D(uSampler8, coord); } \n" + "else if (sampler == 9) { color = texture2D(uSampler9, coord); } \n" + "else if (sampler == 10) { color = texture2D(uSampler10, coord); } \n" + "else if (sampler == 11) { color = texture2D(uSampler11, coord); } \n" + "else if (sampler == 12) { color = texture2D(uSampler12, coord); } \n" + "else if (sampler == 13) { color = texture2D(uSampler13, coord); } \n" + "else if (sampler == 14) { color = texture2D(uSampler14, coord); } \n" + "else if (sampler == 15) { color = texture2D(uSampler15, coord); } \n" + "else { color = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t)); } \n" + "gl_FragColor = vec4(color.rgb, color.a * vAlpha);\n" + "}");
                ctx.compileShader(textureShader);
                if (!ctx.getShaderParameter(textureShader, ctx.COMPILE_STATUS)) {
                    alert(ctx.getShaderInfoLog(textureShader));
                }
                var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
                ctx.shaderSource(vertexShader, "" + "attribute vec3 aVertexPosition;\n" + "attribute vec3 aTextureCoord;\n" + "attribute float aAlpha;\n" + "uniform mat4 uPMatrix;\n" + "uniform bool uSnapToPixel;\n" + "varying vec3 vTextureCoord;\n" + "varying float vAlpha;\n" + "void main(void) { \n" + "vTextureCoord = aTextureCoord; \n" + "vAlpha = aAlpha; \n" + "gl_Position = uPMatrix * vec4(aVertexPosition, 1.0);\n" + "}");
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
                program.orthMatrixUniform = ctx.getUniformLocation(program, "uPMatrix");
                program.alphaUniform = ctx.getUniformLocation(program, "uAlpha");
                program.snapToUniform = ctx.getUniformLocation(program, "uSnapToPixel");
                ctx.useProgram(program);
                this._vertexDataCount = 7;
                this._root2 = Math.sqrt(2);
                this._index = 0;
                this._textures = [];
                this._cacheTextures = [];
                this._degToRad = Math.PI / 180;
                if (window.Float32Array) {
                    this.vertices = new window.Float32Array(this._vertexDataCount * 4 * 5e3);
                } else {
                    this.vertices = new Array(this._vertexDataCount * 4 * 5e3);
                }
                this.arrayBuffer = ctx.createBuffer();
                this.indexBuffer = ctx.createBuffer();
                ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
                ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                var byteCount = this._vertexDataCount * 4;
                ctx.vertexAttribPointer(program.vertexPositionAttribute, 3, ctx.FLOAT, 0, byteCount, 0);
                ctx.vertexAttribPointer(program.uvCoordAttribute, 3, ctx.FLOAT, 0, byteCount, 12);
                ctx.vertexAttribPointer(program.colorAttribute, 1, ctx.FLOAT, 0, byteCount, 24);
                if (window.Uint16Array) {
                    this.indices = new window.Uint16Array(3e4);
                } else {
                    this.indices = new Array(3e4);
                }
                for (var i = 0, l = this.indices.length; i < l; i += 6) {
                    var j = i * 4 / 6;
                    this.indices.set([j, j + 1, j + 2, j, j + 2, j + 3], i);
                }
                ctx.bufferData(ctx.ARRAY_BUFFER, this.vertices, ctx.STREAM_DRAW);
                ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, this.indices, ctx.STATIC_DRAW);
                ARE.GLMatrix.mat4.ortho(0, ctx.viewportWidth, ctx.viewportHeight, 0, -this.MAX_DEPTH, this.MAX_DEPTH, surface.orthMatrix);
                ctx.viewport(0, 0, ctx.viewportWidth, ctx.viewportHeight);
                ctx.colorMask(true, true, true, true);
                ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, ctx.SRC_ALPHA, ctx.ONE);
                ctx.enable(ctx.BLEND);
                ctx.disable(ctx.DEPTH_TEST);
                surface.init = true;
            },
            "_initTexture": function (src, ctx) {
                if (!src) {
                    return;
                }
                var textures = this._textures;
                var textureCount = this._cacheTextures.length + this._textures.length;
                for (var i = 0, l = textures.length; i < l; i++) {
                    if (textures[i].image == src) {
                        src.glTexture = textures[i];
                        return i;
                    }
                }
                if (!src.glTexture) {
                    src.glTexture = ctx.createTexture();
                    src.glTexture.image = src;
                    ctx.activeTexture(ctx["TEXTURE" + textureCount]);
                    ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
                    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, src.glTexture.image);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                } else {
                    ctx.activeTexture(ctx["TEXTURE" + textureCount]);
                    ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
                }
                ctx.uniform1i(ctx.getUniformLocation(ctx.canvas.shader, "uSampler" + textureCount.toString()), textureCount);
                textures.push(src.glTexture);
                return textureCount;
            },
            "_initCache": function (o, src, ctx) {
                if (!src) {
                    return;
                }
                var textures = this._cacheTextures;
                var textureCount = this._textures.length;
                for (var i = 0, l = textures.length; i < l; i++) {
                    if (o.cacheID && textures[i]._cacheID == o.cacheID) {
                        textures[i]._isUsed = true;
                        src.glTexture = textures[i];
                        ctx.activeTexture(ctx["TEXTURE" + textureCount]);
                        ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
                        this._textures.push(src.glTexture);
                        return i;
                    }
                }
                if (!src.glTexture) {
                    src.glTexture = ctx.createTexture();
                    src.glTexture.image = src;
                    ctx.activeTexture(ctx["TEXTURE" + textureCount]);
                    ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
                    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, src.glTexture.image);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                } else {
                    ctx.activeTexture(ctx["TEXTURE" + textureCount]);
                    ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
                }
                ctx.uniform1i(ctx.getUniformLocation(ctx.canvas.shader, "uSampler" + textureCount.toString()), textureCount);
                src._cacheID = o.cacheID;
                src.glTexture._isUsed = true;
                this._textures.push(src.glTexture);
                textures.push(src.glTexture);
                return textureCount;
            },
            "render": function (displayObject, surface) {
                displayObject = displayObject || this.root;
                surface = surface || this.surface;
                var ctx = surface.ctx;
                if (this.snapToPixel) {
                    ctx.uniform1i(surface.shader.snapToUniform, 1);
                } else {
                    ctx.uniform1i(surface.shader.snapToUniform, 0);
                }
                ARE.GLMatrix.mat4.identity(surface.idMatrix);
                ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
                ctx.uniformMatrix4fv(surface.shader.orthMatrixUniform, false, surface.orthMatrix);
                if (!surface.init) {
                    this.initSurface(surface);
                }
                if (displayObject && surface) {
                    var docFrag = document.createDocumentFragment();
                    this._render(ctx, displayObject, surface.idMatrix, docFrag);
                    this._draw(ctx);
                }
                this._cleanCache();
            },
            "_getCompositeOperation": function (o) {
                if (o.compositeOperation) return o.compositeOperation;
                if (o.parent) return this._getCompositeOperation(o.parent);
            },
            "_render": function (ctx, o, matrix, docFrag) {
                var mat4 = ARE.GLMatrix.mat4;
                if (!o.isVisible()) {
                    return;
                }
                var testLength = (this._index + 4) * this._vertexDataCount;
                if (this.vertices.length < testLength) {
                    this._draw(ctx);
                }
                var uFrame = 0,
                    vFrame = 0,
                    u = 1,
                    v = 1,
                    img = 0;
                var degToRad = this._degToRad;
                var mvMatrix = this._getMat4();
                var samplerID = 0;
                var compositeOperation = this._getCompositeOperation(o);
                if (compositeOperation === "lighter") {
                    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
                } else {
                    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
                }
                var mmyCanvas = o.cacheCanvas || o.txtCanvas;
                if (mmyCanvas) {
                    samplerID = this._initCache(o, mmyCanvas, ctx);
                    mat4.translate(matrix, [o.x, o.y, 0], mvMatrix);
                    mat4.rotateX(mvMatrix, o.skewX * degToRad);
                    mat4.rotateY(mvMatrix, o.skewY * degToRad);
                    mat4.rotateZ(mvMatrix, o.rotation * degToRad);
                    mat4.scale(mvMatrix, [o.scaleX * mmyCanvas.width, o.scaleY * mmyCanvas.height, 1]);
                    mat4.translate(mvMatrix, [-o.originX, -o.originY, 0]);
                } else if (o instanceof ARE.Container) {
                    var list = o.children.slice(0);
                    mat4.translate(matrix, [o.x, o.y, 0], mvMatrix);
                    mat4.rotateX(mvMatrix, o.skewX * degToRad);
                    mat4.rotateY(mvMatrix, o.skewY * degToRad);
                    mat4.rotateZ(mvMatrix, o.rotation * degToRad);
                    mat4.scale(mvMatrix, [o.scaleX, o.scaleY, 1]);
                    mat4.translate(mvMatrix, [-o.originX, -o.originY, 0]);
                    for (var i = 0, l = list.length; i < l; i++) {
                        this._render(ctx, list[i], mvMatrix);
                    }
                    this._poolMat4(mvMatrix);
                    return;
                } else if (o instanceof ARE.Bitmap || o instanceof ARE.Sprite) {
                    var rect = o.rect;
                    img = o.img;
                    samplerID = this._initTexture(img, ctx);
                    u = rect[2] / img.width;
                    v = rect[3] / img.height;
                    uFrame = rect[0] / img.width;
                    vFrame = rect[1] / img.height;
                    mat4.translate(matrix, [o.x, o.y, 0], mvMatrix);
                    mat4.rotateX(mvMatrix, o.skewX * degToRad);
                    mat4.rotateY(mvMatrix, o.skewY * degToRad);
                    mat4.rotateZ(mvMatrix, o.rotation * degToRad);
                    mat4.scale(mvMatrix, [o.scaleX * rect[2], o.scaleY * rect[3], 1]);
                    mat4.translate(mvMatrix, [-o.originX, -o.originY, 0]);
                }
                var pos1 = mat4.multiplyVec3(mvMatrix, [0, 0, 0]);
                var pos2 = mat4.multiplyVec3(mvMatrix, [0, 1, 0]);
                var pos3 = mat4.multiplyVec3(mvMatrix, [1, 1, 0]);
                var pos4 = mat4.multiplyVec3(mvMatrix, [1, 0, 0]);
                var alpha = o.alpha;
                this.vertices.set([pos1[0], pos1[1], pos1[2], uFrame, vFrame, samplerID, alpha, pos2[0], pos2[1], pos2[2], uFrame, vFrame + v, samplerID, alpha, pos3[0], pos3[1], pos3[2], uFrame + u, vFrame + v, samplerID, alpha, pos4[0], pos4[1], pos4[2], uFrame + u, vFrame, samplerID, alpha], this._index * this._vertexDataCount);
                this._index += 4;
                this._poolMat4(mvMatrix);
                if (this._textures.length + this._cacheTextures.length > 31) {
                    this._draw(ctx);
                }
            },
            "_draw": function (ctx) {
                ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.vertices.subarray(0, this._index * this._vertexDataCount));
                ctx.drawElements(ctx.TRIANGLES, this._index * 1.5, ctx.UNSIGNED_SHORT, 0);
                this._index = 0;
                this._textureCount = 0;
                this._textures = [];
            },
            "_cleanCache": function () {
                var textures = this._cacheTextures;
                for (var i = 0, l = textures.length; i < l; i++) {
                    if (!textures[i]._isUsed) {
                        textures.splice(i, 1);
                        i--;
                        l--;
                    } else {
                        textures[i]._isUsed = false;
                    }
                }
            },
            "_getMat4": function () {
                if (this._matPool.length > 0) {
                    return this._matPool.pop();
                } else {
                    return ARE.GLMatrix.mat4.create();
                }
            },
            "_poolMat4": function (mat) {
                this._matPool.push(mat);
            },
            "update": function () {
                this.clear();
                if (this.tickOnUpdate) {
                    this.tickDisplayList(this.root, this.arguments);
                }
                this.render(this.root, this.surface);
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
                } else if (o instanceof ARE.Shape) {
                    for (var i = 0, len = o.cmds.length; i < len; i++) {
                        var cmd = o.cmds[i];
                        if (o.assMethod.join("-").match(new RegExp("\\b" + cmd[0] + "\\b", "g"))) {
                            ctx[cmd[0]] = cmd[1][0];
                        } else {
                            ctx[cmd[0]].apply(ctx, Array.prototype.slice.call(cmd[1]));
                        }
                    }
                }
            }
        });

        //end-------------------ARE.WebGLRenderer---------------------end

        //begin-------------------ARE.FPS---------------------begin

        ARE.FPS = __class.extend({
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
                ARE.RAF.requestInterval(function () {
                    var lastIndex = self.fpsList.length - 1;
                    self.value = self.fpsList[lastIndex];
                    if (lastIndex > 500) {
                        self.fpsList.shift();
                    }
                }, 200);
            },
            "_computeFPS": function () {
                this.current = new Date();
                this.fpsList.push(parseInt(1e3 / (this.current - this.last)));
                this.last = this.current;
            }
        });

        //end-------------------ARE.FPS---------------------end

        //begin-------------------ARE.RAF---------------------begin

        ARE.RAF = __class.extend({
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

        //begin-------------------ARE.Particle---------------------begin

        ARE.Particle = ARE.Bitmap.extend({
            "ctor": function (option) {
                this._super(option.texture);
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

        //end-------------------ARE.Particle---------------------end

        //begin-------------------ARE.GLMatrix---------------------begin

        ARE.GLMatrix = __class.extend({
            "statics": {
                "ctor": function () {
                    var glMatrixArrayType = typeof window.Float32Array != "undefined" ? window.Float32Array : typeof window.WebGLFloatArray != "undefined" ? window.WebGLFloatArray : Array;
                    var vec3 = {};
                    vec3.create = function (a) {
                        var b = new glMatrixArrayType(3);
                        if (a) {
                            b[0] = a[0];
                            b[1] = a[1];
                            b[2] = a[2];
                        }
                        return b;
                    };
                    vec3.set = function (a, b) {
                        b[0] = a[0];
                        b[1] = a[1];
                        b[2] = a[2];
                        return b;
                    };
                    vec3.add = function (a, b, c) {
                        if (!c || a == c) {
                            a[0] += b[0];
                            a[1] += b[1];
                            a[2] += b[2];
                            return a;
                        }
                        c[0] = a[0] + b[0];
                        c[1] = a[1] + b[1];
                        c[2] = a[2] + b[2];
                        return c;
                    };
                    vec3.subtract = function (a, b, c) {
                        if (!c || a == c) {
                            a[0] -= b[0];
                            a[1] -= b[1];
                            a[2] -= b[2];
                            return a;
                        }
                        c[0] = a[0] - b[0];
                        c[1] = a[1] - b[1];
                        c[2] = a[2] - b[2];
                        return c;
                    };
                    vec3.negate = function (a, b) {
                        b || (b = a);
                        b[0] = -a[0];
                        b[1] = -a[1];
                        b[2] = -a[2];
                        return b;
                    };
                    vec3.scale = function (a, b, c) {
                        if (!c || a == c) {
                            a[0] *= b;
                            a[1] *= b;
                            a[2] *= b;
                            return a;
                        }
                        c[0] = a[0] * b;
                        c[1] = a[1] * b;
                        c[2] = a[2] * b;
                        return c;
                    };
                    vec3.normalize = function (a, b) {
                        b || (b = a);
                        var c = a[0],
                            d = a[1],
                            e = a[2],
                            g = Math.sqrt(c * c + d * d + e * e);
                        if (g) {
                            if (g == 1) {
                                b[0] = c;
                                b[1] = d;
                                b[2] = e;
                                return b;
                            }
                        } else {
                            b[0] = 0;
                            b[1] = 0;
                            b[2] = 0;
                            return b;
                        }
                        g = 1 / g;
                        b[0] = c * g;
                        b[1] = d * g;
                        b[2] = e * g;
                        return b;
                    };
                    vec3.cross = function (a, b, c) {
                        c || (c = a);
                        var d = a[0],
                            e = a[1];
                        a = a[2];
                        var g = b[0],
                            f = b[1];
                        b = b[2];
                        c[0] = e * b - a * f;
                        c[1] = a * g - d * b;
                        c[2] = d * f - e * g;
                        return c;
                    };
                    vec3.length = function (a) {
                        var b = a[0],
                            c = a[1];
                        a = a[2];
                        return Math.sqrt(b * b + c * c + a * a);
                    };
                    vec3.dot = function (a, b) {
                        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
                    };
                    vec3.direction = function (a, b, c) {
                        c || (c = a);
                        var d = a[0] - b[0],
                            e = a[1] - b[1];
                        a = a[2] - b[2];
                        b = Math.sqrt(d * d + e * e + a * a);
                        if (!b) {
                            c[0] = 0;
                            c[1] = 0;
                            c[2] = 0;
                            return c;
                        }
                        b = 1 / b;
                        c[0] = d * b;
                        c[1] = e * b;
                        c[2] = a * b;
                        return c;
                    };
                    vec3.lerp = function (a, b, c, d) {
                        d || (d = a);
                        d[0] = a[0] + c * (b[0] - a[0]);
                        d[1] = a[1] + c * (b[1] - a[1]);
                        d[2] = a[2] + c * (b[2] - a[2]);
                        return d;
                    };
                    vec3.str = function (a) {
                        return "[" + a[0] + ", " + a[1] + ", " + a[2] + "]";
                    };
                    var mat3 = {};
                    mat3.create = function (a) {
                        var b = new glMatrixArrayType(9);
                        if (a) {
                            b[0] = a[0];
                            b[1] = a[1];
                            b[2] = a[2];
                            b[3] = a[3];
                            b[4] = a[4];
                            b[5] = a[5];
                            b[6] = a[6];
                            b[7] = a[7];
                            b[8] = a[8];
                            b[9] = a[9];
                        }
                        return b;
                    };
                    mat3.set = function (a, b) {
                        b[0] = a[0];
                        b[1] = a[1];
                        b[2] = a[2];
                        b[3] = a[3];
                        b[4] = a[4];
                        b[5] = a[5];
                        b[6] = a[6];
                        b[7] = a[7];
                        b[8] = a[8];
                        return b;
                    };
                    mat3.identity = function (a) {
                        a[0] = 1;
                        a[1] = 0;
                        a[2] = 0;
                        a[3] = 0;
                        a[4] = 1;
                        a[5] = 0;
                        a[6] = 0;
                        a[7] = 0;
                        a[8] = 1;
                        return a;
                    };
                    mat3.transpose = function (a, b) {
                        if (!b || a == b) {
                            var c = a[1],
                                d = a[2],
                                e = a[5];
                            a[1] = a[3];
                            a[2] = a[6];
                            a[3] = c;
                            a[5] = a[7];
                            a[6] = d;
                            a[7] = e;
                            return a;
                        }
                        b[0] = a[0];
                        b[1] = a[3];
                        b[2] = a[6];
                        b[3] = a[1];
                        b[4] = a[4];
                        b[5] = a[7];
                        b[6] = a[2];
                        b[7] = a[5];
                        b[8] = a[8];
                        return b;
                    };
                    mat3.toMat4 = function (a, b) {
                        b || (b = mat4.create());
                        b[0] = a[0];
                        b[1] = a[1];
                        b[2] = a[2];
                        b[3] = 0;
                        b[4] = a[3];
                        b[5] = a[4];
                        b[6] = a[5];
                        b[7] = 0;
                        b[8] = a[6];
                        b[9] = a[7];
                        b[10] = a[8];
                        b[11] = 0;
                        b[12] = 0;
                        b[13] = 0;
                        b[14] = 0;
                        b[15] = 1;
                        return b;
                    };
                    mat3.str = function (a) {
                        return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + "]";
                    };
                    var mat4 = {};
                    mat4.create = function (a) {
                        var b = new glMatrixArrayType(16);
                        if (a) {
                            b[0] = a[0];
                            b[1] = a[1];
                            b[2] = a[2];
                            b[3] = a[3];
                            b[4] = a[4];
                            b[5] = a[5];
                            b[6] = a[6];
                            b[7] = a[7];
                            b[8] = a[8];
                            b[9] = a[9];
                            b[10] = a[10];
                            b[11] = a[11];
                            b[12] = a[12];
                            b[13] = a[13];
                            b[14] = a[14];
                            b[15] = a[15];
                        }
                        return b;
                    };
                    mat4.set = function (a, b) {
                        b[0] = a[0];
                        b[1] = a[1];
                        b[2] = a[2];
                        b[3] = a[3];
                        b[4] = a[4];
                        b[5] = a[5];
                        b[6] = a[6];
                        b[7] = a[7];
                        b[8] = a[8];
                        b[9] = a[9];
                        b[10] = a[10];
                        b[11] = a[11];
                        b[12] = a[12];
                        b[13] = a[13];
                        b[14] = a[14];
                        b[15] = a[15];
                        return b;
                    };
                    mat4.identity = function (a) {
                        a[0] = 1;
                        a[1] = 0;
                        a[2] = 0;
                        a[3] = 0;
                        a[4] = 0;
                        a[5] = 1;
                        a[6] = 0;
                        a[7] = 0;
                        a[8] = 0;
                        a[9] = 0;
                        a[10] = 1;
                        a[11] = 0;
                        a[12] = 0;
                        a[13] = 0;
                        a[14] = 0;
                        a[15] = 1;
                        return a;
                    };
                    mat4.transpose = function (a, b) {
                        if (!b || a == b) {
                            var c = a[1],
                                d = a[2],
                                e = a[3],
                                g = a[6],
                                f = a[7],
                                h = a[11];
                            a[1] = a[4];
                            a[2] = a[8];
                            a[3] = a[12];
                            a[4] = c;
                            a[6] = a[9];
                            a[7] = a[13];
                            a[8] = d;
                            a[9] = g;
                            a[11] = a[14];
                            a[12] = e;
                            a[13] = f;
                            a[14] = h;
                            return a;
                        }
                        b[0] = a[0];
                        b[1] = a[4];
                        b[2] = a[8];
                        b[3] = a[12];
                        b[4] = a[1];
                        b[5] = a[5];
                        b[6] = a[9];
                        b[7] = a[13];
                        b[8] = a[2];
                        b[9] = a[6];
                        b[10] = a[10];
                        b[11] = a[14];
                        b[12] = a[3];
                        b[13] = a[7];
                        b[14] = a[11];
                        b[15] = a[15];
                        return b;
                    };
                    mat4.determinant = function (a) {
                        var b = a[0],
                            c = a[1],
                            d = a[2],
                            e = a[3],
                            g = a[4],
                            f = a[5],
                            h = a[6],
                            i = a[7],
                            j = a[8],
                            k = a[9],
                            l = a[10],
                            o = a[11],
                            m = a[12],
                            n = a[13],
                            p = a[14];
                        a = a[15];
                        return m * k * h * e - j * n * h * e - m * f * l * e + g * n * l * e + j * f * p * e - g * k * p * e - m * k * d * i + j * n * d * i + m * c * l * i - b * n * l * i - j * c * p * i + b * k * p * i + m * f * d * o - g * n * d * o - m * c * h * o + b * n * h * o + g * c * p * o - b * f * p * o - j * f * d * a + g * k * d * a + j * c * h * a - b * k * h * a - g * c * l * a + b * f * l * a;
                    };
                    mat4.inverse = function (a, b) {
                        b || (b = a);
                        var c = a[0],
                            d = a[1],
                            e = a[2],
                            g = a[3],
                            f = a[4],
                            h = a[5],
                            i = a[6],
                            j = a[7],
                            k = a[8],
                            l = a[9],
                            o = a[10],
                            m = a[11],
                            n = a[12],
                            p = a[13],
                            r = a[14],
                            s = a[15],
                            A = c * h - d * f,
                            B = c * i - e * f,
                            t = c * j - g * f,
                            u = d * i - e * h,
                            v = d * j - g * h,
                            w = e * j - g * i,
                            x = k * p - l * n,
                            y = k * r - o * n,
                            z = k * s - m * n,
                            C = l * r - o * p,
                            D = l * s - m * p,
                            E = o * s - m * r,
                            q = 1 / (A * E - B * D + t * C + u * z - v * y + w * x);
                        b[0] = (h * E - i * D + j * C) * q;
                        b[1] = (-d * E + e * D - g * C) * q;
                        b[2] = (p * w - r * v + s * u) * q;
                        b[3] = (-l * w + o * v - m * u) * q;
                        b[4] = (-f * E + i * z - j * y) * q;
                        b[5] = (c * E - e * z + g * y) * q;
                        b[6] = (-n * w + r * t - s * B) * q;
                        b[7] = (k * w - o * t + m * B) * q;
                        b[8] = (f * D - h * z + j * x) * q;
                        b[9] = (-c * D + d * z - g * x) * q;
                        b[10] = (n * v - p * t + s * A) * q;
                        b[11] = (-k * v + l * t - m * A) * q;
                        b[12] = (-f * C + h * y - i * x) * q;
                        b[13] = (c * C - d * y + e * x) * q;
                        b[14] = (-n * u + p * B - r * A) * q;
                        b[15] = (k * u - l * B + o * A) * q;
                        return b;
                    };
                    mat4.toRotationMat = function (a, b) {
                        b || (b = mat4.create());
                        b[0] = a[0];
                        b[1] = a[1];
                        b[2] = a[2];
                        b[3] = a[3];
                        b[4] = a[4];
                        b[5] = a[5];
                        b[6] = a[6];
                        b[7] = a[7];
                        b[8] = a[8];
                        b[9] = a[9];
                        b[10] = a[10];
                        b[11] = a[11];
                        b[12] = 0;
                        b[13] = 0;
                        b[14] = 0;
                        b[15] = 1;
                        return b;
                    };
                    mat4.toMat3 = function (a, b) {
                        b || (b = mat3.create());
                        b[0] = a[0];
                        b[1] = a[1];
                        b[2] = a[2];
                        b[3] = a[4];
                        b[4] = a[5];
                        b[5] = a[6];
                        b[6] = a[8];
                        b[7] = a[9];
                        b[8] = a[10];
                        return b;
                    };
                    mat4.toInverseMat3 = function (a, b) {
                        var c = a[0],
                            d = a[1],
                            e = a[2],
                            g = a[4],
                            f = a[5],
                            h = a[6],
                            i = a[8],
                            j = a[9],
                            k = a[10],
                            l = k * f - h * j,
                            o = -k * g + h * i,
                            m = j * g - f * i,
                            n = c * l + d * o + e * m;
                        if (!n) return null;
                        n = 1 / n;
                        b || (b = mat3.create());
                        b[0] = l * n;
                        b[1] = (-k * d + e * j) * n;
                        b[2] = (h * d - e * f) * n;
                        b[3] = o * n;
                        b[4] = (k * c - e * i) * n;
                        b[5] = (-h * c + e * g) * n;
                        b[6] = m * n;
                        b[7] = (-j * c + d * i) * n;
                        b[8] = (f * c - d * g) * n;
                        return b;
                    };
                    mat4.multiply = function (a, b, c) {
                        c || (c = a);
                        var d = a[0],
                            e = a[1],
                            g = a[2],
                            f = a[3],
                            h = a[4],
                            i = a[5],
                            j = a[6],
                            k = a[7],
                            l = a[8],
                            o = a[9],
                            m = a[10],
                            n = a[11],
                            p = a[12],
                            r = a[13],
                            s = a[14];
                        a = a[15];
                        var A = b[0],
                            B = b[1],
                            t = b[2],
                            u = b[3],
                            v = b[4],
                            w = b[5],
                            x = b[6],
                            y = b[7],
                            z = b[8],
                            C = b[9],
                            D = b[10],
                            E = b[11],
                            q = b[12],
                            F = b[13],
                            G = b[14];
                        b = b[15];
                        c[0] = A * d + B * h + t * l + u * p;
                        c[1] = A * e + B * i + t * o + u * r;
                        c[2] = A * g + B * j + t * m + u * s;
                        c[3] = A * f + B * k + t * n + u * a;
                        c[4] = v * d + w * h + x * l + y * p;
                        c[5] = v * e + w * i + x * o + y * r;
                        c[6] = v * g + w * j + x * m + y * s;
                        c[7] = v * f + w * k + x * n + y * a;
                        c[8] = z * d + C * h + D * l + E * p;
                        c[9] = z * e + C * i + D * o + E * r;
                        c[10] = z * g + C * j + D * m + E * s;
                        c[11] = z * f + C * k + D * n + E * a;
                        c[12] = q * d + F * h + G * l + b * p;
                        c[13] = q * e + F * i + G * o + b * r;
                        c[14] = q * g + F * j + G * m + b * s;
                        c[15] = q * f + F * k + G * n + b * a;
                        return c;
                    };
                    mat4.multiplyVec3 = function (a, b, c) {
                        c || (c = b);
                        var d = b[0],
                            e = b[1];
                        b = b[2];
                        c[0] = a[0] * d + a[4] * e + a[8] * b + a[12];
                        c[1] = a[1] * d + a[5] * e + a[9] * b + a[13];
                        c[2] = a[2] * d + a[6] * e + a[10] * b + a[14];
                        return c;
                    };
                    mat4.multiplyVec4 = function (a, b, c) {
                        c || (c = b);
                        var d = b[0],
                            e = b[1],
                            g = b[2];
                        b = b[3];
                        c[0] = a[0] * d + a[4] * e + a[8] * g + a[12] * b;
                        c[1] = a[1] * d + a[5] * e + a[9] * g + a[13] * b;
                        c[2] = a[2] * d + a[6] * e + a[10] * g + a[14] * b;
                        c[3] = a[3] * d + a[7] * e + a[11] * g + a[15] * b;
                        return c;
                    };
                    mat4.translate = function (a, b, c) {
                        var d = b[0],
                            e = b[1];
                        b = b[2];
                        if (!c || a == c) {
                            a[12] = a[0] * d + a[4] * e + a[8] * b + a[12];
                            a[13] = a[1] * d + a[5] * e + a[9] * b + a[13];
                            a[14] = a[2] * d + a[6] * e + a[10] * b + a[14];
                            a[15] = a[3] * d + a[7] * e + a[11] * b + a[15];
                            return a;
                        }
                        var g = a[0],
                            f = a[1],
                            h = a[2],
                            i = a[3],
                            j = a[4],
                            k = a[5],
                            l = a[6],
                            o = a[7],
                            m = a[8],
                            n = a[9],
                            p = a[10],
                            r = a[11];
                        c[0] = g;
                        c[1] = f;
                        c[2] = h;
                        c[3] = i;
                        c[4] = j;
                        c[5] = k;
                        c[6] = l;
                        c[7] = o;
                        c[8] = m;
                        c[9] = n;
                        c[10] = p;
                        c[11] = r;
                        c[12] = g * d + j * e + m * b + a[12];
                        c[13] = f * d + k * e + n * b + a[13];
                        c[14] = h * d + l * e + p * b + a[14];
                        c[15] = i * d + o * e + r * b + a[15];
                        return c;
                    };
                    mat4.scale = function (a, b, c) {
                        var d = b[0],
                            e = b[1];
                        b = b[2];
                        if (!c || a == c) {
                            a[0] *= d;
                            a[1] *= d;
                            a[2] *= d;
                            a[3] *= d;
                            a[4] *= e;
                            a[5] *= e;
                            a[6] *= e;
                            a[7] *= e;
                            a[8] *= b;
                            a[9] *= b;
                            a[10] *= b;
                            a[11] *= b;
                            return a;
                        }
                        c[0] = a[0] * d;
                        c[1] = a[1] * d;
                        c[2] = a[2] * d;
                        c[3] = a[3] * d;
                        c[4] = a[4] * e;
                        c[5] = a[5] * e;
                        c[6] = a[6] * e;
                        c[7] = a[7] * e;
                        c[8] = a[8] * b;
                        c[9] = a[9] * b;
                        c[10] = a[10] * b;
                        c[11] = a[11] * b;
                        c[12] = a[12];
                        c[13] = a[13];
                        c[14] = a[14];
                        c[15] = a[15];
                        return c;
                    };
                    mat4.rotate = function (a, b, c, d) {
                        var e = c[0],
                            g = c[1];
                        c = c[2];
                        var f = Math.sqrt(e * e + g * g + c * c);
                        if (!f) return null;
                        if (f != 1) {
                            f = 1 / f;
                            e *= f;
                            g *= f;
                            c *= f;
                        }
                        var h = Math.sin(b),
                            i = Math.cos(b),
                            j = 1 - i;
                        b = a[0];
                        f = a[1];
                        var k = a[2],
                            l = a[3],
                            o = a[4],
                            m = a[5],
                            n = a[6],
                            p = a[7],
                            r = a[8],
                            s = a[9],
                            A = a[10],
                            B = a[11],
                            t = e * e * j + i,
                            u = g * e * j + c * h,
                            v = c * e * j - g * h,
                            w = e * g * j - c * h,
                            x = g * g * j + i,
                            y = c * g * j + e * h,
                            z = e * c * j + g * h;
                        e = g * c * j - e * h;
                        g = c * c * j + i;
                        if (d) {
                            if (a != d) {
                                d[12] = a[12];
                                d[13] = a[13];
                                d[14] = a[14];
                                d[15] = a[15];
                            }
                        } else d = a;
                        d[0] = b * t + o * u + r * v;
                        d[1] = f * t + m * u + s * v;
                        d[2] = k * t + n * u + A * v;
                        d[3] = l * t + p * u + B * v;
                        d[4] = b * w + o * x + r * y;
                        d[5] = f * w + m * x + s * y;
                        d[6] = k * w + n * x + A * y;
                        d[7] = l * w + p * x + B * y;
                        d[8] = b * z + o * e + r * g;
                        d[9] = f * z + m * e + s * g;
                        d[10] = k * z + n * e + A * g;
                        d[11] = l * z + p * e + B * g;
                        return d;
                    };
                    mat4.rotateX = function (a, b, c) {
                        var d = Math.sin(b);
                        b = Math.cos(b);
                        var e = a[4],
                            g = a[5],
                            f = a[6],
                            h = a[7],
                            i = a[8],
                            j = a[9],
                            k = a[10],
                            l = a[11];
                        if (c) {
                            if (a != c) {
                                c[0] = a[0];
                                c[1] = a[1];
                                c[2] = a[2];
                                c[3] = a[3];
                                c[12] = a[12];
                                c[13] = a[13];
                                c[14] = a[14];
                                c[15] = a[15];
                            }
                        } else c = a;
                        c[4] = e * b + i * d;
                        c[5] = g * b + j * d;
                        c[6] = f * b + k * d;
                        c[7] = h * b + l * d;
                        c[8] = e * -d + i * b;
                        c[9] = g * -d + j * b;
                        c[10] = f * -d + k * b;
                        c[11] = h * -d + l * b;
                        return c;
                    };
                    mat4.rotateY = function (a, b, c) {
                        var d = Math.sin(b);
                        b = Math.cos(b);
                        var e = a[0],
                            g = a[1],
                            f = a[2],
                            h = a[3],
                            i = a[8],
                            j = a[9],
                            k = a[10],
                            l = a[11];
                        if (c) {
                            if (a != c) {
                                c[4] = a[4];
                                c[5] = a[5];
                                c[6] = a[6];
                                c[7] = a[7];
                                c[12] = a[12];
                                c[13] = a[13];
                                c[14] = a[14];
                                c[15] = a[15];
                            }
                        } else c = a;
                        c[0] = e * b + i * -d;
                        c[1] = g * b + j * -d;
                        c[2] = f * b + k * -d;
                        c[3] = h * b + l * -d;
                        c[8] = e * d + i * b;
                        c[9] = g * d + j * b;
                        c[10] = f * d + k * b;
                        c[11] = h * d + l * b;
                        return c;
                    };
                    mat4.rotateZ = function (a, b, c) {
                        var d = Math.sin(b);
                        b = Math.cos(b);
                        var e = a[0],
                            g = a[1],
                            f = a[2],
                            h = a[3],
                            i = a[4],
                            j = a[5],
                            k = a[6],
                            l = a[7];
                        if (c) {
                            if (a != c) {
                                c[8] = a[8];
                                c[9] = a[9];
                                c[10] = a[10];
                                c[11] = a[11];
                                c[12] = a[12];
                                c[13] = a[13];
                                c[14] = a[14];
                                c[15] = a[15];
                            }
                        } else c = a;
                        c[0] = e * b + i * d;
                        c[1] = g * b + j * d;
                        c[2] = f * b + k * d;
                        c[3] = h * b + l * d;
                        c[4] = e * -d + i * b;
                        c[5] = g * -d + j * b;
                        c[6] = f * -d + k * b;
                        c[7] = h * -d + l * b;
                        return c;
                    };
                    mat4.frustum = function (a, b, c, d, e, g, f) {
                        f || (f = mat4.create());
                        var h = b - a,
                            i = d - c,
                            j = g - e;
                        f[0] = e * 2 / h;
                        f[1] = 0;
                        f[2] = 0;
                        f[3] = 0;
                        f[4] = 0;
                        f[5] = e * 2 / i;
                        f[6] = 0;
                        f[7] = 0;
                        f[8] = (b + a) / h;
                        f[9] = (d + c) / i;
                        f[10] = -(g + e) / j;
                        f[11] = -1;
                        f[12] = 0;
                        f[13] = 0;
                        f[14] = -(g * e * 2) / j;
                        f[15] = 0;
                        return f;
                    };
                    mat4.perspective = function (a, b, c, d, e) {
                        a = c * Math.tan(a * Math.PI / 360);
                        b = a * b;
                        return mat4.frustum(-b, b, -a, a, c, d, e);
                    };
                    mat4.ortho = function (a, b, c, d, e, g, f) {
                        f || (f = mat4.create());
                        var h = b - a,
                            i = d - c,
                            j = g - e;
                        f[0] = 2 / h;
                        f[1] = 0;
                        f[2] = 0;
                        f[3] = 0;
                        f[4] = 0;
                        f[5] = 2 / i;
                        f[6] = 0;
                        f[7] = 0;
                        f[8] = 0;
                        f[9] = 0;
                        f[10] = -2 / j;
                        f[11] = 0;
                        f[12] = -(a + b) / h;
                        f[13] = -(d + c) / i;
                        f[14] = -(g + e) / j;
                        f[15] = 1;
                        return f;
                    };
                    mat4.lookAt = function (a, b, c, d) {
                        d || (d = mat4.create());
                        var e = a[0],
                            g = a[1];
                        a = a[2];
                        var f = c[0],
                            h = c[1],
                            i = c[2];
                        c = b[1];
                        var j = b[2];
                        if (e == b[0] && g == c && a == j) return mat4.identity(d);
                        var k, l, o, m;
                        c = e - b[0];
                        j = g - b[1];
                        b = a - b[2];
                        m = 1 / Math.sqrt(c * c + j * j + b * b);
                        c *= m;
                        j *= m;
                        b *= m;
                        k = h * b - i * j;
                        i = i * c - f * b;
                        f = f * j - h * c;
                        if (m = Math.sqrt(k * k + i * i + f * f)) {
                            m = 1 / m;
                            k *= m;
                            i *= m;
                            f *= m;
                        } else f = i = k = 0;
                        h = j * f - b * i;
                        l = b * k - c * f;
                        o = c * i - j * k;
                        if (m = Math.sqrt(h * h + l * l + o * o)) {
                            m = 1 / m;
                            h *= m;
                            l *= m;
                            o *= m;
                        } else o = l = h = 0;
                        d[0] = k;
                        d[1] = h;
                        d[2] = c;
                        d[3] = 0;
                        d[4] = i;
                        d[5] = l;
                        d[6] = j;
                        d[7] = 0;
                        d[8] = f;
                        d[9] = o;
                        d[10] = b;
                        d[11] = 0;
                        d[12] = -(k * e + i * g + f * a);
                        d[13] = -(h * e + l * g + o * a);
                        d[14] = -(c * e + j * g + b * a);
                        d[15] = 1;
                        return d;
                    };
                    mat4.str = function (a) {
                        return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + "]";
                    };
                    var quat4 = {};
                    quat4.create = function (a) {
                        var b = new glMatrixArrayType(4);
                        if (a) {
                            b[0] = a[0];
                            b[1] = a[1];
                            b[2] = a[2];
                            b[3] = a[3];
                        }
                        return b;
                    };
                    quat4.set = function (a, b) {
                        b[0] = a[0];
                        b[1] = a[1];
                        b[2] = a[2];
                        b[3] = a[3];
                        return b;
                    };
                    quat4.calculateW = function (a, b) {
                        var c = a[0],
                            d = a[1],
                            e = a[2];
                        if (!b || a == b) {
                            a[3] = -Math.sqrt(Math.abs(1 - c * c - d * d - e * e));
                            return a;
                        }
                        b[0] = c;
                        b[1] = d;
                        b[2] = e;
                        b[3] = -Math.sqrt(Math.abs(1 - c * c - d * d - e * e));
                        return b;
                    };
                    quat4.inverse = function (a, b) {
                        if (!b || a == b) {
                            a[0] *= 1;
                            a[1] *= 1;
                            a[2] *= 1;
                            return a;
                        }
                        b[0] = -a[0];
                        b[1] = -a[1];
                        b[2] = -a[2];
                        b[3] = a[3];
                        return b;
                    };
                    quat4.length = function (a) {
                        var b = a[0],
                            c = a[1],
                            d = a[2];
                        a = a[3];
                        return Math.sqrt(b * b + c * c + d * d + a * a);
                    };
                    quat4.normalize = function (a, b) {
                        b || (b = a);
                        var c = a[0],
                            d = a[1],
                            e = a[2],
                            g = a[3],
                            f = Math.sqrt(c * c + d * d + e * e + g * g);
                        if (f == 0) {
                            b[0] = 0;
                            b[1] = 0;
                            b[2] = 0;
                            b[3] = 0;
                            return b;
                        }
                        f = 1 / f;
                        b[0] = c * f;
                        b[1] = d * f;
                        b[2] = e * f;
                        b[3] = g * f;
                        return b;
                    };
                    quat4.multiply = function (a, b, c) {
                        c || (c = a);
                        var d = a[0],
                            e = a[1],
                            g = a[2];
                        a = a[3];
                        var f = b[0],
                            h = b[1],
                            i = b[2];
                        b = b[3];
                        c[0] = d * b + a * f + e * i - g * h;
                        c[1] = e * b + a * h + g * f - d * i;
                        c[2] = g * b + a * i + d * h - e * f;
                        c[3] = a * b - d * f - e * h - g * i;
                        return c;
                    };
                    quat4.multiplyVec3 = function (a, b, c) {
                        c || (c = b);
                        var d = b[0],
                            e = b[1],
                            g = b[2];
                        b = a[0];
                        var f = a[1],
                            h = a[2];
                        a = a[3];
                        var i = a * d + f * g - h * e,
                            j = a * e + h * d - b * g,
                            k = a * g + b * e - f * d;
                        d = -b * d - f * e - h * g;
                        c[0] = i * a + d * -b + j * -h - k * -f;
                        c[1] = j * a + d * -f + k * -b - i * -h;
                        c[2] = k * a + d * -h + i * -f - j * -b;
                        return c;
                    };
                    quat4.toMat3 = function (a, b) {
                        b || (b = mat3.create());
                        var c = a[0],
                            d = a[1],
                            e = a[2],
                            g = a[3],
                            f = c + c,
                            h = d + d,
                            i = e + e,
                            j = c * f,
                            k = c * h;
                        c = c * i;
                        var l = d * h;
                        d = d * i;
                        e = e * i;
                        f = g * f;
                        h = g * h;
                        g = g * i;
                        b[0] = 1 - (l + e);
                        b[1] = k - g;
                        b[2] = c + h;
                        b[3] = k + g;
                        b[4] = 1 - (j + e);
                        b[5] = d - f;
                        b[6] = c - h;
                        b[7] = d + f;
                        b[8] = 1 - (j + l);
                        return b;
                    };
                    quat4.toMat4 = function (a, b) {
                        b || (b = mat4.create());
                        var c = a[0],
                            d = a[1],
                            e = a[2],
                            g = a[3],
                            f = c + c,
                            h = d + d,
                            i = e + e,
                            j = c * f,
                            k = c * h;
                        c = c * i;
                        var l = d * h;
                        d = d * i;
                        e = e * i;
                        f = g * f;
                        h = g * h;
                        g = g * i;
                        b[0] = 1 - (l + e);
                        b[1] = k - g;
                        b[2] = c + h;
                        b[3] = 0;
                        b[4] = k + g;
                        b[5] = 1 - (j + e);
                        b[6] = d - f;
                        b[7] = 0;
                        b[8] = c - h;
                        b[9] = d + f;
                        b[10] = 1 - (j + l);
                        b[11] = 0;
                        b[12] = 0;
                        b[13] = 0;
                        b[14] = 0;
                        b[15] = 1;
                        return b;
                    };
                    quat4.slerp = function (a, b, c, d) {
                        d || (d = a);
                        var e = c;
                        if (a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3] < 0) e = -1 * c;
                        d[0] = 1 - c * a[0] + e * b[0];
                        d[1] = 1 - c * a[1] + e * b[1];
                        d[2] = 1 - c * a[2] + e * b[2];
                        d[3] = 1 - c * a[3] + e * b[3];
                        return d;
                    };
                    quat4.str = function (a) {
                        return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + "]";
                    };
                    this.mat4 = mat4;
                    this.quat4 = quat4;
                    this.vec3 = vec3;
                }
            }
        });

        //end-------------------ARE.GLMatrix---------------------end

        //begin-------------------ARE.Util---------------------begin

        ARE.Util = __class.extend({
            "statics": {
                "random": function (min, max) {
                    return min + Math.floor(Math.random() * (max - min + 1));
                }
            }
        });

        //end-------------------ARE.Util---------------------end

        //begin-------------------ARE.ParticleSystem---------------------begin

        ARE.ParticleSystem = ARE.Container.extend({
            "ctor": function (option) {
                this._super();
                this.speed = option.speed;
                this.angle = option.angle;
                this.angleRange = option.angleRange;
                this.emitArea = option.emitArea;
                this.gravity = option.gravity;
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
                var angle = (this.angle + ARE.Util.random(-this.angleRange / 2, this.angleRange / 2)) * Math.PI / 180;
                var particle = new ARE.Particle({
                    position: new ARE.Vector2(this.emitX + ARE.Util.random(0, this.emitArea[0]), this.emitY + ARE.Util.random(0, this.emitArea[1])),
                    velocity: new ARE.Vector2(this.speed * Math.cos(angle), this.speed * Math.sin(angle)),
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

        //end-------------------ARE.ParticleSystem---------------------end

        //begin-------------------ARE.Vector2---------------------begin

        ARE.Vector2 = __class.extend({
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

        //begin-------------------ARE.Keyboard---------------------begin

        ARE.Keyboard = __class.extend({
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
    })();
})(Function('return this')())