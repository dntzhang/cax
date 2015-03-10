/**
* 显示对象的基类
*
* @class DisplayObject
* @constructor
*/
define("ARE.DisplayObject", {
    ctor: function () {
        this.alpha = this.scaleX = this.scaleY = 1;
        this.x = this.y = this.rotation = this.originX = this.originY = this.skewX = this.skewY = this.width = this.height = 0;
        this.flipX = this.flipY = false;
        this.visible = true;
        this._matrix = new Matrix2D();
        this.events = {};
        this.id = UID.get();

        this.baseInstanceof = "DisplayObject";
        var self = this;
        this._watch(this, "originX", function (prop, value) {

            self.regX = self.width * value;
        })
        this._watch(this, "originY", function (prop, value) {
            self.regY = self.height * value;
        })
    },
    _watch: function (target, prop, onPropertyChanged) {
        var self = this, currentValue = target["__" + prop] = this[prop];
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
    /**
    * 判断是否可见
    * @method isVisible
    * @return {Boolean} 如果可见返回true，否则返回false
    */
    isVisible: function () {
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
    },
     /**
     * 绑定事件
     * @method on
     * @param {string} type - 绑定的事件类型.
     * @param {function} fn - 事件触发的回调函数.
     */
    on: function (type, fn) {
        ["mouseover", "mousemove", "mouseout", "touchstart", "touchmove", "touchend"].join("_").match(type)&&(Stage.checkMove = true);
        this.events[type] || (this.events[type] = []);
        this.events[type].push(fn)
    },
    execEvent: function (type) {
        var fns = this.events[type];

            this._fireFns(fns);
    },
    hover: function (over,out) {
        this.on("mouseover", over);
        this.on("mouseout", out);
    },
    _fireFns: function (fns) {
        if (fns) {
            for (var i = 0, len = fns.length; i < len; i++) {
                fns[i].call(this);
            }
        }
    },
    /**
     * 克隆
     * @method clone
     */
    clone : function() {
        var o = new DisplayObject();
        this.cloneProps(o);
        return o;
    },
    cloneProps: function (o) {
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
    /**
     * 缓存
     * @method cache
     */
    cache : function() {
        // draw to canvas.
        //scale = scale || 1;
        if (!this.cacheCanvas) {
            this.cacheCanvas = document.createElement("canvas");
            var bound = this.getBound();
            this.cacheCanvas.width = bound.width;
            this.cacheCanvas.height = bound.height;
            this.cacheCtx = this.cacheCanvas.getContext("2d");
        } 
       
        //this._cacheScale = scale;
        

        Stage.renderer.updateCache(this.cacheCtx, this, bound.width, bound.height);
    },
    /**
     * 清除缓存 
     * @method uncache
     */
    uncache: function () {
        this.cacheCanvas = null;
        this.cacheCtx = null;
        this.cacheID=null;
    },
    /**
     * 获取包围盒 
     * @method getBound
     */
    getBound: function () {
        return { width: this.width, height: this.height };
    },
    /**
     * 定位至父容器中心 
     * @method toCenter
     */
    toCenter: function () {
        this.originX = 0.5;
        this.originY = 0.5;
        this.x = this.parent.width / 2;
        this.y = this.parent.height / 2;;
    },
    onClick: function (fn) {
        this.on("click", fn);
    },
    onMouseMove: function (fn) {
        this.on("mousemove", fn);
    }
})