
//begin-------------------ARE.DisplayObject---------------------begin

ARE.DisplayObject = __class.extend({
    "ctor": function() {
        this.alpha = this.scaleX = this.scaleY = 1;
        this.x = this.y = this.rotation = this.originX = this.originY = this.skewX = this.skewY = this.width = this.height = 0;
        this.flipX = this.flipY = false;
        this.visible = true;
        this._matrix = new ARE.Matrix2D();
        this.events = {};
        this.id = ARE.UID.get();
        this.cacheID = 0;
        this.baseInstanceof = "DisplayObject";
        var self = this;
        this._watch(this, "originX", function(prop, value) {
            self.regX = self.width * value;
        });
        this._watch(this, "originY", function(prop, value) {
            self.regY = self.height * value;
        });
    },
    "_watch": function(target, prop, onPropertyChanged) {
        var self = this,
            currentValue = target["__" + prop] = this[prop];
        Object.defineProperty(target, prop, {
            get: function() {
                return this["__" + prop];
            },
            set: function(value) {
                this["__" + prop] = value;
                onPropertyChanged(prop, value);
            }
        });
    },
    "isVisible": function() {
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
    },
    "on": function(type, fn) {["mouseover", "mousemove", "mouseout", "touchstart", "touchmove", "touchend"].join("_").match(type) && (ARE.Stage.checkMove = true);
        this.events[type] || (this.events[type] = []);
        this.events[type].push(fn);
    },
    "execEvent": function(type) {
        var fns = this.events[type];
        this._fireFns(fns);
    },
    "hover": function(over, out) {
        this.on("mouseover", over);
        this.on("mouseout", out);
    },
    "_fireFns": function(fns) {
        if (fns) {
            for (var i = 0, len = fns.length; i < len; i++) {
                fns[i].call(this);
            }
        }
    },
    "clone": function() {
        var o = new ARE.DisplayObject();
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
        this.cacheID = ARE.UID.getCacheID();
        ARE.Stage.renderer.updateCache(this.cacheCtx, this, bound.width, bound.height);
    },
    "uncache": function() {
        this.cacheCanvas = null;
        this.cacheCtx = null;
        this.cacheID = null;
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
    "onClick": function(fn) {
        this.on("click", fn);
    },
    "onMouseMove": function(fn) {
        this.on("mousemove", fn);
    }
});

//end-------------------ARE.DisplayObject---------------------end
