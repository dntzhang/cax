import Matrix2D from '../base/matrix2d.js'
import EventDispatcher from '../base/event_dispatcher.js'
import UID from '../base/uid.js'

class DisplayObject extends EventDispatcher {
    constructor() {
        super()
        this.alpha = this.complexAlpha = this.scaleX = this.scaleY = 1
        this.x = this.y = this.rotation = this.skewX = this.skewY = this.originX = this.originY = 0
        this.cursor = "default"
        this.visible = true
        this._matrix = new Matrix2D()
        this._hitMatrix = new Matrix2D()
        this.id = UID.get()
    }

    isVisible() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0
    }

    initAABB() {
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
    }
}

export default DisplayObject;