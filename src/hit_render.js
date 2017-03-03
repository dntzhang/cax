import Container from './container.js'
import Graphics from './graphics.js'
import Render from './render.js'
import Event from './event.js'

class HitRender extends  Render {
    constructor(canvas) {
        super()

        this.canvas = document.createElement('canvas')
        this.canvas.width = 1
        this.canvas.height = 1
        this.ctx = this.canvas.getContext('2d')

        //document.body.appendChild(this.canvas)
    }

    render(obj) {
        this.ctx.save()
        obj._computeMatrix()
        this.ctx.transform(obj._matrix.a, obj._matrix.b, obj._matrix.c, obj._matrix.d, obj._matrix.tx, obj._matrix.ty)
        if (obj instanceof Graphics) {
            this.renderGraphics(obj)
        } else if (obj instanceof  Container) {
        }
        this.ctx.restore()
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    hitAABB(root, evt) {
    }

    hitPixel( o, evt) {
        let ctx = this.ctx;
        let mtx = o._hitMatrix;
        let list = o.children.slice(0),
            l = list.length;
        for (let i = l - 1; i >= 0; i--) {
            let child = list[i];
            mtx.initialize(1, 0, 0, 1, 0, 0);
            mtx.appendTransform(o.x - evt.stageX, o.y - evt.stageY, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            if (!this.checkBoundEvent(child)) continue;
            ctx.save();
            var target = this._hitPixel( child, evt, mtx );
            ctx.restore();
            if (target) return target;
        }
    }

    checkBoundEvent(){
        return true;
    }

    _hitPixel(o, evt,mtx ) {
        let ctx = this.ctx
        ctx.clearRect(0, 0, 2, 2)
        if (mtx) {
            o._hitMatrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty)
        } else {
            o._hitMatrix.initialize(1, 0, 0, 1, 0, 0)
        }
        mtx = o._hitMatrix;
        mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        if (o instanceof Graphics) {
            ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            this.renderGraphics(o);
        }

        if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
            this._dispatchEvent(o, evt);

            return o;
        }
    }

    _dispatchEvent(obj,evt){
        let mockEvt  = new Event();
        mockEvt.stageX = evt.StageX;
        mockEvt.stageY = evt.stageY;
        mockEvt.pureEvent = evt;
        mockEvt.type = evt.type;
        obj.dispatchEvent(mockEvt);
    }

    renderGraphics(obj){

        obj.cmds.forEach(cmd => {
            const methodName = cmd[0]
            if (obj.assMethod.join("-").match(new RegExp("\\b" + methodName + "\\b", "g"))) {
                this.ctx[methodName] = cmd[1][0];
            } else if (methodName === "addColorStop") {
                obj.currentGradient && obj.currentGradient.addColorStop(cmd[1][0], cmd[1][1])
            } else if (methodName === "fillGradient") {
                this.ctx.fillStyle = obj.currentGradient
            } else {
                let result = this.ctx[methodName].apply(this.ctx, Array.prototype.slice.call(cmd[1]))
                if (methodName === "createRadialGradient" || methodName === "createLinearGradient") {
                    obj.currentGradient = result
                }
            }
        })
    }

}

export default HitRender;