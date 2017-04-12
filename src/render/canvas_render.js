import Group from '../display/group.js'
import Graphics from '../display/graphics.js'
import Render from './render.js'
import Path from '../display/path.js'
import Circle from '../display/circle.js'
import Sprite from '../display/sprite.js'

class CanvasRender extends  Render {
    constructor(canvas){
        super()
        this.ctx = canvas.getContext('2d')
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
    }

    render(obj){
        this.ctx.save()
        this.ctx.globalAlpha = obj.complexAlpha;
        this.ctx.setTransform(obj._matrix.a,obj._matrix.b,obj._matrix.c,obj._matrix.d,obj._matrix.tx,obj._matrix.ty)
        if(obj instanceof Graphics){
            this.renderGraphics(obj)
        }else if (obj instanceof  Path|| obj instanceof Circle){
            obj.draw(this.ctx)
        }else if ( obj instanceof Sprite) {
            obj.updateFrame()
            var rect = obj.rect;
            this.ctx.drawImage(obj.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
        }
        this.ctx.restore()
    }

    clear(){
        this.ctx.clearRect(0,0,this.width,this.height)
    }

    hitAABB(){

    }

    hitPixel(){

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

export default CanvasRender;