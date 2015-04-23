
//begin-------------------ARE.CanvasRenderer---------------------begin

ARE.CanvasRenderer = __class.extend({
    "ctor": function(canvas) {
        if (canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext("2d");
            this.height = this.canvas.width;
            this.width = this.canvas.height;
        }
    },
    "hitAABB": function(ctx, o, mtx, x, y, type) {
        var list = o.children.slice(0),
            l = list.length;
        for (var i = l - 1; i >= 0; i--) {
            var child = list[i];
            if (!this.isbindingEvent(child)) continue;
            var target = this._hitAABB(ctx, child, mtx, x, y, type);
            if (target) return target;
        }
    },
    "_hitAABB": function(ctx, o, mtx, x, y, type) {
        if (!o.isVisible()) {
            return;
        }
        if (o instanceof ARE.Container) {
            var list = o.children.slice(0),
                l = list.length;
            for (var i = l - 1; i >= 0; i--) {
                var child = list[i];
                var target = this._hitAABB(ctx, child, mtx, x, y, type);
                if (target) return target;
            }
        } else {
            if (this.checkPointInAABB(x, y, o.AABB)) {
                this._bubbleEvent(o, type, x, y);
                return o;
            }
        }
    },
    "hitRender": function(ctx, o, mtx, x, y, type) {
        if (mtx) {
            o._hitMatrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        } else {
            o._hitMatrix.initialize(1, 0, 0, 1, 0, 0);
        }
        mtx = o._hitMatrix;
        mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        var list = o.children.slice(0),
            l = list.length;
        for (var i = l - 1; i >= 0; i--) {
            var child = list[i];
            mtx.initialize(1, 0, 0, 1, 0, 0);
            mtx.appendTransform(o.x - x, o.y - y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            if (!this.isbindingEvent(child)) continue;
            ctx.save();
            var target = this._hitRender(ctx, child, mtx, x, y, type);
            ctx.restore();
            if (target) return target;
        }
    },
    "_hitRender": function(ctx, o, mtx, x, y, type) {
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
                var target = this._hitRender(ctx, list[i], mtx, x, y, type);
                if (target) return target;
                ctx.restore();
            }
        } else if (o instanceof ARE.Bitmap || o instanceof ARE.Sprite) {
            ctx.globalAlpha = o.complexAlpha;
            ctx.globalCompositeOperation = o.complexCompositeOperation;
            var rect = o.rect;
            ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
        }
        if (ctx.getImageData(0, 0, 1, 1).data[3] > 1 && !(o instanceof ARE.Container)) {
            this._bubbleEvent(o, type, x, y);
            return o;
        }
    },
    "_bubbleEvent": function(o, type, x, y) {
        var result = o.execEvent(type, x, y);
        if (result !== false) {
            if (o.parent && o.parent.events[type] && o.parent.events[type].length > 0 && o.parent.baseInstanceof !== "Stage") {
                this._bubbleEvent(o.parent, type, x, y);
            }
        }
    },
    "isbindingEvent": function(obj) {
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
    "clear": function() {
        this.ctx.clearRect(0, 0, this.height, this.width);
    },
    "renderObj": function(ctx, o) {
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
        }
        ctx.restore();
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

//end-------------------ARE.CanvasRenderer---------------------end
